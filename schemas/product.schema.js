const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
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
    images: {
        type: Array,
        required: 'Images are required'
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);