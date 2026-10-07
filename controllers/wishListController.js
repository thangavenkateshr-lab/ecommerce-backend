const WishList = require('../models/wishListModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middwares/catchAsyncError');

exports.createWishList = catchAsyncError(async(req, res, next) => {
    const productId = req.body.id;
    const alreadyAdded = await WishList.findOne({
        user : req.user.id,
        product : productId
    });
    if(alreadyAdded){
        return next(new ErrorHandler('You have already added this product in wishlist'))
    }
    const wishList = await WishList.create({
        user : req.user.id,
        product  : productId
    });
    res.status(201).send({
        success : true,
        wishList
    });
});

exports.getWishLists = catchAsyncError(async(req, res, next) => {
    const wishLists = await WishList.find({user : req.user.id}).populate('product')
    if(wishLists.length == 0){
        return next(new ErrorHandler('Your wishlist is empty', 404));
    }
    res.status(200).send({
        success : true,
        wishLists
    });
});

exports.deleteWishList = catchAsyncError(async(req, res, next) => {
    const wishLists = await WishList.find({user : req.user.id});
    if(wishLists.length == 0){
        return next(new ErrorHandler('WishLists was empty', 404));
    }
    const filteredWishLists = wishLists.filter((item) =>  item._id.toString() === req.params.id.toString());
    if (filteredWishLists.length === 0) {
        return next(new ErrorHandler("Cart not found", 404));
    }
    await WishList.findByIdAndDelete(filteredWishLists[0]._id);
    res.status(201).send({
        success : true
    });
});