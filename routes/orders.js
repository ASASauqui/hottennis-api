const express = require('express');

const router = express.Router();

const { mustBeUser } = require('../middleware/mustBeUser');
const { adminMiddleware } = require('../middleware/adminMiddleware');

const {
    getOrders,
    createOrder,
    updateOrder,
    getOrder
} = require('../controllers/orders');

router.get('/', mustBeUser, getOrders);
router.get('/:id', mustBeUser, getOrder);
router.post('/', mustBeUser, createOrder);
router.put('/:id', mustBeUser, updateOrder);

module.exports = router;