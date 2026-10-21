/**
 * Controller: Blood Requests Management
 *
 * Implements full lifecycle for emergency blood requests:
 * - Creation with patient, blood group, units, hospital, and urgency date.
 * - Requester / Admin access control (RBAC).
 * - Editability restricted exclusively to 'Pending' requests.
 * - Admin status transitions: 'Approved', 'Fulfilled', 'Rejected'.
 * - Atomic stock decrement on 'Fulfilled' status with concurrency safety against negative inventory.
 */

const Request = require('../models/Request');
const Stock = require('../models/Stock');

const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const createRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, units, hospital, requiredByDate } = req.body;

    if (!patientName || !bloodGroup || !units || !hospital || !requiredByDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const trimmedPatient = patientName.trim();
    const trimmedHospital = hospital.trim();
    if (!trimmedPatient || !trimmedHospital) {
      return res.status(400).json({ message: 'Patient name and hospital cannot be blank' });
    }

    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ message: `Invalid blood group. Must be one of: ${validBloodGroups.join(', ')}` });
    }

    const numUnits = Number(units);
    if (!Number.isInteger(numUnits) || numUnits < 1) {
      return res.status(400).json({ message: 'Units must be a positive integer of at least 1' });
    }

    const reqDate = new Date(requiredByDate);
    if (isNaN(reqDate.getTime())) {
      return res.status(400).json({ message: 'Invalid required-by date provided' });
    }

    const newRequest = await Request.create({
      requester: req.user._id,
      patientName: trimmedPatient,
      bloodGroup,
      units: numUnits,
      hospital: trimmedHospital,
      requiredByDate: reqDate,
      status: 'Pending',
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('requester', 'name email phone');
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // RBAC: Requesters can only access their own request; Admins can access any
    if (req.user.role !== 'admin' && request.requester._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You do not have permission to view this request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: You do not have permission to edit this request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Only requests with 'Pending' status can be modified. Current status: ${request.status}` });
    }

    const { patientName, bloodGroup, units, hospital, requiredByDate } = req.body;

    if (patientName) {
      const trimmed = patientName.trim();
      if (!trimmed) return res.status(400).json({ message: 'Patient name cannot be blank' });
      request.patientName = trimmed;
    }

    if (bloodGroup) {
      if (!validBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({ message: `Invalid blood group. Must be one of: ${validBloodGroups.join(', ')}` });
      }
      request.bloodGroup = bloodGroup;
    }

    if (units !== undefined) {
      const numUnits = Number(units);
      if (!Number.isInteger(numUnits) || numUnits < 1) {
        return res.status(400).json({ message: 'Units must be a positive integer of at least 1' });
      }
      request.units = numUnits;
    }

    if (hospital) {
      const trimmed = hospital.trim();
      if (!trimmed) return res.status(400).json({ message: 'Hospital cannot be blank' });
      request.hospital = trimmed;
    }

    if (requiredByDate) {
      const reqDate = new Date(requiredByDate);
      if (isNaN(reqDate.getTime())) {
        return res.status(400).json({ message: 'Invalid required-by date provided' });
      }
      request.requiredByDate = reqDate;
    }

    const updated = await request.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate('requester', 'name email phone bloodGroup')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const allowedStatuses = ['Approved', 'Fulfilled', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (request.status === 'Fulfilled') {
      return res.status(400).json({ message: 'Request is already fulfilled and cannot be transitioned' });
    }

    if (request.status === 'Rejected') {
      return res.status(400).json({ message: 'Request has already been rejected and cannot be transitioned' });
    }

    // Atomic stock decrement with concurrency protection
    if (status === 'Fulfilled') {
      const updatedStock = await Stock.findOneAndUpdate(
        { bloodGroup: request.bloodGroup, unitsAvailable: { $gte: request.units } },
        { $inc: { unitsAvailable: -request.units } },
        { new: true }
      );

      if (!updatedStock) {
        const stock = await Stock.findOne({ bloodGroup: request.bloodGroup });
        const currentAvailable = stock ? stock.unitsAvailable : 0;
        return res.status(400).json({
          message: `Insufficient inventory for ${request.bloodGroup}. Available: ${currentAvailable} unit(s), Requested: ${request.units} unit(s).`,
        });
      }
    }

    request.status = status;
    if (status === 'Rejected' && rejectionReason) {
      request.rejectionReason = rejectionReason.trim();
    }

    const updatedRequest = await request.save();
    res.json({
      message: `Request status transitioned to ${status} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestById,
  updateRequest,
  getAllRequests,
  updateRequestStatus,
};
