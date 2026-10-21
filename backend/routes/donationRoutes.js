const express = require('express');
const router = express.Router();
const { recordDonation, getMyDonations, getAllDonations } = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, recordDonation);
router.get('/my', protect, getMyDonations);
router.get('/', protect, adminOnly, getAllDonations);

module.exports = router;
