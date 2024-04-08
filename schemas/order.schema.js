const mongoose = require('mongoose');
const { Schema } = mongoose;


const OrderSchema = new Schema({
    products: {
        type: Array,
        required: 'Products are required'
    },
    transaction_id: {},
    amount: {
        type: Number,
        required: 'Amount is required'
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    status: {
        type: String,
        default: 'Not processed',
        enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);