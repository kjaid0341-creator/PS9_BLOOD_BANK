const express = require('express');
const router = express.Router();
const { getMyProfile, getAllDonors, getDonorById } = require('../controllers/donorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.get('/', protect, adminOnly, getAllDonors);
router.get('/:id', protect, adminOnly, getDonorById);

module.exports = router;
