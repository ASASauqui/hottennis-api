const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    brand: {
        type: String,
        trim: true,
        required: 'Brand is required'
    },
    description: {
        type: String,
        trim: true,
        required: 'Description is required'
    },
    price: {
        type: Number,
        required: 'price is required'
    },  
    stock: {
        type: Number,
        required: 'Stock is required',
        min: 0
    },    
    images: {
        type: Array,
        required: 'Images are required'
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);