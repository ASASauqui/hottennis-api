const express = require('express');
const { upload } = require('../utils/multer_config');

const router = express.Router();

const {
    getAllProducts,
    createProduct,
    returnImage,
    getProduct
} = require('../controllers/products');
const { mustBeUser } = require('../middleware/mustBeUser');
const { apiMiddleware } = require('../middleware/apiMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/', apiMiddleware, getAllProducts);
router.get('/:id', apiMiddleware, getProduct);
router.get('/image/:id', returnImage);
router.post('/', adminMiddleware, upload.array("images", 10), createProduct);
// router.delete('/:id', mustBeUser, deleteMove);

module.exports = router;
