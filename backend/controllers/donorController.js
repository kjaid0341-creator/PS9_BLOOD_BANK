/**
 * Controller: Donor Profile & Directory Management
 *
 * Provides endpoints for:
 * - Donor self-profile inspection with real-time dynamic eligibility verification.
 * - Admin directory listing with multi-field search and filters (blood group, city, name/email/phone).
 * - Detailed single donor profile with chronological donation history.
 */

const User = require('../models/User');
const Donation = require('../models/Donation');
const Setting = require('../models/Setting');
const { calculateEligibility } = require('../utils/eligibility');

// Helper: Safely escape user input for RegExp queries
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const gapSetting = await Setting.findOne({ key: 'minDonationGapDays' });
    const minGapDays = gapSetting ? Number(gapSetting.value) : 90;

    const eligibility = calculateEligibility(user.dob, user.lastDonationDate, minGapDays);

    res.json({
      user,
      eligibility,
      minGapDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, city, search } = req.query;
    const query = { role: 'donor' };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (city && city.trim()) {
      query.city = { $regex: escapeRegex(city.trim()), $options: 'i' };
    }

    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const donors = await User.find(query).select('-password').sort({ createdAt: -1 });

    const gapSetting = await Setting.findOne({ key: 'minDonationGapDays' });
    const minGapDays = gapSetting ? Number(gapSetting.value) : 90;

    const donorsWithEligibility = donors.map((donor) => {
      const eligibility = calculateEligibility(donor.dob, donor.lastDonationDate, minGapDays);
      return {
        ...donor.toObject(),
        eligibility,
      };
    });

    res.json(donorsWithEligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDonorById = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select('-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor record not found' });
    }

    const gapSetting = await Setting.findOne({ key: 'minDonationGapDays' });
    const minGapDays = gapSetting ? Number(gapSetting.value) : 90;
    const eligibility = calculateEligibility(donor.dob, donor.lastDonationDate, minGapDays);

    const donations = await Donation.find({ donor: donor._id }).sort({ donationDate: -1 });

    res.json({
      donor,
      eligibility,
      donations,
      minGapDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, getAllDonors, getDonorById };
