const Cart = require('../models/cartModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middwares/catchAsyncError');

exports.createCart = catchAsyncError(async(req, res, next) => {
    const { productId, quantity } = req.body;
    const added = await Cart.findOne({
        product:productId,
        user : req.user.id
    });
    if(added){
        return next(new ErrorHandler('You are already added this product', 400));
    }
    const cart = await Cart.create({
        product : productId,
        user : req.user.id,
        quantity
    })
    res.status(201).send({
        success : true,
        cart
    });
});

exports.getCarts = catchAsyncError(async(req, res, next) => {
    const user = req.user.id;
    const carts = await Cart.find({user}).populate("product")
    if(carts.length == 0){
        return next(new ErrorHandler('Your cart is empty', 404));
    }
    res.status(201).send({
        success : true,
        carts
    });
});

exports.updateCarts = catchAsyncError(async(req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.id);
    if(!cart){
        return next(new ErrorHandler('Cart not found', 404));
    }
    cart.quantity = quantity;
    await cart.save();
    res.status(201).send({
        success : true,
    });
});

exports.deleteCart = catchAsyncError(async (req, res, next) => {
    const carts = await Cart.find({ user: req.user.id });
    if (carts.length === 0) {
        return next(new ErrorHandler("Your cart is empty", 404));
    }
    const filteredCart = carts.filter(
        (item) =>  item._id.toString() === req.params.id.toString()
    );

    if (filteredCart.length === 0) {
        return next(new ErrorHandler("Cart not found", 404));
    }

    await Cart.findByIdAndDelete(filteredCart[0]._id);

    res.status(200).json({
        success: true,
        message: "Cart removed successfully"
    });
});