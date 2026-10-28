const express = require('express');
const router = express.Router();
const { createOrder, getOrderById } = require('../controllers/orderController');

router.route('/')
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);

module.exports = router;
