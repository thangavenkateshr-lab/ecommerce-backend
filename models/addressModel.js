const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    address : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    phoneNo : {
        type : String,
        required : true
    },
    postalCode : {
        type : String,
        required : true
    }
}, {timestamps : true});

const addressModel = mongoose.model('Address', addressSchema);

module.exports = addressModel;