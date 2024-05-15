const express = require('express');
const router = express.Router();
const { mustBeUser } = require('../middleware/mustBeUser');

const {
    createCheckoutSession
} = require('../controllers/payments');

router.post('/create-checkout-session', mustBeUser, createCheckoutSession);

module.exports = router;
