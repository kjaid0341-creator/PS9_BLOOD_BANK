const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  updateRequest,
  getAllRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/', protect, adminOnly, getAllRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id', protect, updateRequest);
router.patch('/:id/status', protect, adminOnly, updateRequestStatus);

module.exports = router;
