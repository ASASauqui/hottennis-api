
const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    phone: {
        type: String,
        trim: true,
        required: 'Phone is required'
    },
    email: {
        type: String,
        trim: true,
        required: 'Email is required'
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required'
    },
    profileImage: {
        type: String,
        trim: true,
        default: ''
    },
},{
    timestamps: true
}
);

module.exports = mongoose.model('User', UserSchema);