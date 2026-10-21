/**
 * Controller: System Configuration & Donation Guidelines
 *
 * Manages dynamic operational thresholds:
 * - Minimum donation gap in days (default: 90 days).
 * - Allows administrative adjustment with immediate reflection across eligibility checks.
 */

const Setting = require('../models/Setting');

const getSettings = async (req, res) => {
  try {
    let gapSetting = await Setting.findOne({ key: 'minDonationGapDays' });
    if (!gapSetting) {
      gapSetting = await Setting.create({
        key: 'minDonationGapDays',
        value: 90,
        description: 'Minimum days required between successive blood donations',
      });
    }
    res.json(gapSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { value } = req.body;
    const numValue = Number(value);

    if (!Number.isInteger(numValue) || numValue < 1 || numValue > 365) {
      return res.status(400).json({ message: 'Donation gap must be an integer between 1 and 365 days' });
    }

    const updated = await Setting.findOneAndUpdate(
      { key: 'minDonationGapDays' },
      { value: numValue },
      { upsert: true, new: true }
    );

    res.json({
      message: 'System donation gap setting updated successfully',
      setting: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSetting };
