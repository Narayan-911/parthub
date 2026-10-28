const express = require('express');
const router = express.Router();
const { getParts, getPartById, createPart } = require('../controllers/partController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getParts)
  .post(protect, createPart);

router.route('/:id')
  .get(getPartById);

module.exports = router;
