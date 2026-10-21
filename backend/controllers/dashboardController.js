const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');
const Stock = require('../models/Stock');
const { initializeStock } = require('./stockController');

const getDashboardStats = async (req, res) => {
  try {
    await initializeStock();

    const stock = await Stock.find().sort({ bloodGroup: 1 });
    const LOW_STOCK_THRESHOLD = 5;

    const stockSummary = stock.map((s) => ({
      bloodGroup: s.bloodGroup,
      unitsAvailable: s.unitsAvailable,
      isLowStock: s.unitsAvailable < LOW_STOCK_THRESHOLD,
    }));

    const lowStockGroups = stockSummary.filter((s) => s.isLowStock);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const donationsThisMonth = await Donation.countDocuments({
      donationDate: { $gte: startOfMonth },
    });

    const pendingRequestsCount = await Request.countDocuments({
      status: 'Pending',
    });

    const totalDonors = await User.countDocuments({ role: 'donor' });

    res.json({
      stockSummary,
      lowStockGroups,
      donationsThisMonth,
      pendingRequestsCount,
      totalDonors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
