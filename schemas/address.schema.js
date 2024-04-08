const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
    name:{
        type: String,
        required: 'Name is required'
    },
    address:{
        type: String,
        required: 'Address is required'
    },
    city:{
        type: String,
        required: 'City is required'
    },
    state:{
        type: String,
        required: 'State is required'
    },
    zip:{
        type: String,
        required: 'Zip is required'
    },
    country:{
        type: String,
        required: 'Country is required'
    },
    phone:{
        type: String,
        required: 'Phone is required'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Address', AddressSchema);