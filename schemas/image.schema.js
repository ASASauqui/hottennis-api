const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    data: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Image', ImageSchema);