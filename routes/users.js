const express = require('express');

const router = express.Router();

const { apiMiddleware } = require('../middleware/apiMiddleware');
const { mustBeUser } = require('../middleware/mustBeUser');

const {
    register,
    login,
    getInfo,
    updateInfo
} = require('../controllers/users');

router.post('/register', apiMiddleware, register);
router.post('/login', apiMiddleware, login);
router.put('/', mustBeUser, updateInfo);
router.get('/', mustBeUser, getInfo);

module.exports = router;
