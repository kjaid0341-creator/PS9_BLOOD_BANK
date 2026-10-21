/**
 * Controller: Blood Donations Management
 *
 * Handles recording blood donations:
 * - Checks donor eligibility (age criteria & mandatory rest interval) before accepting donation.
 * - Updates donor's lastDonationDate timestamp.
 * - Atomically increments blood stock inventory using MongoDB's $inc operator.
 * - Provides donor-specific and administrative donation logs.
 */

const Donation = require('../models/Donation');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Setting = require('../models/Setting');
const { calculateEligibility } = require('../utils/eligibility');

const recordDonation = async (req, res) => {
  try {
    const { donorId, units, donationDate } = req.body;

    if (!donorId || units === undefined) {
      return res.status(400).json({ message: 'Donor ID and donation units are required' });
    }

    const numUnits = Number(units);
    if (!Number.isInteger(numUnits) || numUnits < 1) {
      return res.status(400).json({ message: 'Units must be a positive integer of at least 1' });
    }

    const donor = await User.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor record not found' });
    }

    const gapSetting = await Setting.findOne({ key: 'minDonationGapDays' });
    const minGapDays = gapSetting ? Number(gapSetting.value) : 90;

    // Strict eligibility check before recording donation
    const eligibility = calculateEligibility(donor.dob, donor.lastDonationDate, minGapDays);

    if (!eligibility.isEligible) {
      return res.status(400).json({
        message: 'Donor is currently medically ineligible to donate',
        reasons: eligibility.reasons,
        nextEligibleDate: eligibility.nextEligibleDate,
      });
    }

    let donDate = new Date();
    if (donationDate) {
      const parsedDate = new Date(donationDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid donation date provided' });
      }
      if (parsedDate > new Date()) {
        return res.status(400).json({ message: 'Donation date cannot be set in the future' });
      }
      donDate = parsedDate;
    }

    const donation = await Donation.create({
      donor: donor._id,
      bloodGroup: donor.bloodGroup,
      units: numUnits,
      donationDate: donDate,
      recordedBy: req.user._id,
    });

    // Update donor's last donation date
    donor.lastDonationDate = donDate;
    await donor.save();

    // Atomic increment of stock inventory
    await Stock.findOneAndUpdate(
      { bloodGroup: donor.bloodGroup },
      { $inc: { unitsAvailable: numUnits } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Donation recorded successfully and inventory updated',
      donation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).sort({ donationDate: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email phone bloodGroup')
      .populate('recordedBy', 'name')
      .sort({ donationDate: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordDonation, getMyDonations, getAllDonations };
