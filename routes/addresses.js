const express = require('express');

const router = express.Router();

const { mustBeUser } = require('../middleware/mustBeUser');

const {
    getAddresses,
    createAddress,
    deleteAddress
} = require('../controllers/addresses');

router.get('/', mustBeUser, getAddresses);
router.post('/', mustBeUser, createAddress);
router.delete('/:id', mustBeUser, deleteAddress);

module.exports = router;
