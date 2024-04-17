const Product = require('../schemas/product.schema');
const multer = require('multer');
const Image = require('../schemas/image.schema');
// const jwt = require('jsonwebtoken');
// const { isValidObjectId } = require('mongoose');
const { deleteImagesFromDisk } = require('../utils/multer_config');
const fs = require('fs');


/**
 * The function `getMoves` retrieves moves associated with a user based on their decoded token.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and request body. It is used to retrieve
 * information from the client and pass it to the server.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an instance of the Express `Response` object.
 */
const getAllProducts = async (req, res) => {
    try {
        const { limit=10, offset=1, search="" } = req.query;

        var products = null;

        if(search) {
            products = await Product.find({ title: { $regex: search, $options: 'i' } }).limit(limit).skip((offset-1)*limit);
        } else {
            products = await Product.find().limit(limit).skip((offset-1)*limit);
        }


        products.map((product) => {
            product.images = product.images.map((image) => {
                return `${process.env.API_URL}/products/image/${image}`;
            });
        });

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting products'
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        product.images = product.images.map((image) => {
            return `${process.env.API_URL}/products/image/${image}`;
        });

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting product'
        });
    }
}

/**
 * The function `createMove` is an asynchronous function that creates a new move in Cashflow
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as headers, body, query parameters, and
 * more.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is an object that contains methods and properties for handling the response, such as
 * `json()` for sending a JSON response, `status()` for setting the status code of the response, and `
 * @returns a JSON response containing the newly created move object.
 */
const createProduct = async (req, res) => {
    try {
        const { title, description, price, brand, stock } = req.body;

        if(!title || !brand || !description || !price || !stock || !req.files) {
            return res.status(400).json({
                message: 'Missing required fields( title, description, price, images, brand, stock )'
            });
        }

        var images = req.files;               

        images = images.map((image) => {
            return {
                data: fs.readFileSync(image.path),
                contentType: image.mimetype,
            }
        }
        );        

        const saved_images = await Image.insertMany(images);

        const images_ids = saved_images.map((image) => image._id);

        const product = new Product({
            title: title,
            brand: brand,
            description: description,
            price: price,
            stock: stock,
            images: images_ids,
        });

        await product.save();

        deleteImagesFromDisk(images.map((image) => image.filename));

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error creating product'
        });
    }
};

const returnImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Image.findById(id);        

        res.contentType(image.contentType);
        res.send(image.data);        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting images'
        });
    }
};


module.exports = {
    getAllProducts,
    createProduct,
    returnImage,
    getProduct
}