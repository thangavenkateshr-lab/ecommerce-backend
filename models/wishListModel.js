const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    }
},{timestamps : true});

const wishListModel = mongoose.model('WishList', wishListSchema);

module.exports = wishListModel;