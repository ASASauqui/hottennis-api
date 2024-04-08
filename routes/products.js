const express = require('express');
const { upload } = require('../utils/multer_config');

const router = express.Router();

const {
    getAllProducts,
    createProduct,
    returnImage
} = require('../controllers/products');
const { mustBeUser } = require('../middleware/mustBeUser');
const { apiMiddleware } = require('../middleware/apiMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

router.get('/', apiMiddleware, getAllProducts);
router.get('/image/:id', returnImage);
router.post('/', adminMiddleware, upload.array("images", 5), createProduct);
// router.delete('/:id', mustBeUser, deleteMove);

module.exports = router;
