const Order = require('../models/orderModel');
const Address = require('../models/addressModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middwares/catchAsyncError');
const Product = require('../models/productModel');

exports.createOrder = catchAsyncError(async(req,res,next) => {
    const {
        orderItems,
        shippingInfo,
        taxPrice,
        shippingPrice,
        itemPrice,
        totalPrice,
        paymentInfo
    } = req.body;
    const address = await Address.findOne({user:req.user.id});
    if(!address){
        return next(new ErrorHandler('Address not found'));
    }
    const addressId = address.id;
    const order = await Order.create({
        orderItems,
        shippingInfo : addressId,
        taxPrice,
        shippingPrice,
        itemPrice,
        totalPrice,
        paymentInfo,
        user : req.user.id,
        paidAt : Date.now()
    })

    res.status(201).send({
        success : true,
        order
    });
});

exports.singleOrder = catchAsyncError(async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler(`Order not found with this id : ${req.params.id}`,404));
    }
    res.status(201).send({
        success : true,
        order
    });
});

exports.myOrder = catchAsyncError(async(req,res,next) => {
    const order = await Order.find({user:req.user.id});
    if(!order){
        return next(new ErrorHandler('Order not found for this user start shoppin',301));
    }
    res.status(201).send({
        success : true,
        order
    });
});

exports.getAllOrders = catchAsyncError(async(req,res,next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(201).send({
        success : true,
        totalAmount,
        orders
    });
});

exports.updateOrder = catchAsyncError(async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    if(order.orderStatus == 'delivered'){
        return next(new ErrorHandler('Product is already delivered',400));
    }
    order.orderItems.forEach(async(orderItem) => {
        await updateStock(orderItem.product,orderItem.quantity);
    })
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();
    res.status(201).send({
        success : true,
        order
    });
});

async function updateStock(productId,quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave:false})
}

exports.deleteOrder = catchAsyncError(async(req,res,next) => {
    let order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`Order not found with this id : ${req.params.id},400`))
    }
    order = await Order.findByIdAndDelete(req.params.id);
    res.status(201).send({
        success : true,
        message : 'Order deleted successfully'
    });
});