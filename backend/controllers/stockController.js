const Stock = require('../models/Stock');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const initializeStock = async () => {
  for (const group of bloodGroups) {
    const existing = await Stock.findOne({ bloodGroup: group });
    if (!existing) {
      await Stock.create({ bloodGroup: group, unitsAvailable: 0 });
    }
  }
};

const getStock = async (req, res) => {
  try {
    await initializeStock();
    const stock = await Stock.find().sort({ bloodGroup: 1 });

    const LOW_STOCK_THRESHOLD = 5;

    const formattedStock = stock.map((item) => ({
      _id: item._id,
      bloodGroup: item.bloodGroup,
      unitsAvailable: item.unitsAvailable,
      isLowStock: item.unitsAvailable < LOW_STOCK_THRESHOLD,
    }));

    res.json(formattedStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStock, initializeStock };
