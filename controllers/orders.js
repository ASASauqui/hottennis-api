const Order = require('../schemas/order.schema');
const Product = require('../schemas/product.schema');


const STATUS = ['Not processed', 'Payment failed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getOrders = async (req, res) => {
    const { user } = req;
    try {

        const orders = await Order.find({ user: user._id, status: { $nin: ['Payment failed', 'Payment needed'] } }).populate('address');
        
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting orders'
        });
    }
}

const getOrder = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const order = await
        Order.findOne({ _id: id, user: user._id })
        .populate('address');

        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const products_ids = order.products.map((product) => product._id);

        const products = await Product.find({ _id: { $in: products_ids } });

        order.products = products.map((product) => {
            const product_index = order.products.findIndex((p) => p._id == product._id);
            return {
                ...product._doc,
                images: product.images.map((image) => {
                    return `${process.env.API_URL}/products/image/${image}`;
                }),
                quantity: order.products[product_index].quantity
            }
        });
        
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting order'
        });
    }
}

const createOrder = async (req, res) => {
    const { user } = req;
    const { address, products, transaction_id={} } = req.body;

    if(!address || !products) {
        return res.status(400).json({
            message: 'Missing required fields( address, products )'
        });
    }

    products.forEach((product) => {
        if(!product._id || !product.quantity || !product.size ) {
            return res.status(400).json({
                message: 'Missing required fields( _id, quantity, size )'
            });
        }
    });

    try {

        const _products = await Product.find({ _id: { $in: products } });        

        const total = products.reduce((acc, product) => {            
            const product_index = _products.findIndex((p) => p._id == product._id);            
            
            if(product_index == -1) {
                return acc;
            }

            return acc + product.price * products[product_index].quantity;
        }, 0);        


        const new_order = new Order({
            address: address,
            products: products,
            transaction_id: transaction_id,
            amount: total,
            user: user._id
        });

        await new_order.save();

        res.json(new_order);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error creating order'
        });
    }
}

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(id);

    if (!status) {
        return res.status(400).json({
            message: 'Missing required fields( status )'
        });
    }

    if(!STATUS.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status, must be one of: Not processed, Processing, Shipped, Delivered, Cancelled'
        });
    }

    try {
        const order = await Order.findOne({ _id: id });

        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;

        await order.save();

        res.json(order);

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: 'Error updating order'
        });
    }
}

module.exports = {
    getOrders,
    createOrder,
    updateOrder,
    getOrder
}