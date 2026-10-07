const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address',
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    orderItems : [{
        name : { 
            type : String,
            required : true
        },
        quantity : {
            type : Number,
            required : true
        },
        images : {
            type : String,
            required : true
        },
        price : {
            type : String,
            required : true
        },
        product : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'Product'
        }
    }],
    itemsPrice : {
        type : Number,
        required : true,
        default : 0.0
    },
    taxPrice : {
        type : Number,
        required : true,
        default : 0.0
    },
    shippingPrice : {
        type : Number,
        required : true,
        default : 0.0
    },
    totalPrice : {
        type : Number,
        required : true,
        default : 0.0
    },
    paidAt : {
        type : Date
    },
    deliveredAt : {
        type : Date
    },
    orderStatus : {
        type : String,
        required : true,
        default : 'Processing'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const orderModel = mongoose.model('Order',orderSchema);

module.exports = orderModel;