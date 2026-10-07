const Address = require('../models/addressModel');
const catchAsyncError = require('../middwares/catchAsyncError');
const  ErrorHandler = require('../utils/errorHandler');

exports.createAddress = catchAsyncError(async(req, res, next) => {
    const { address, country, city, phoneNo, postalCode } = req.body;
    let userAddress = await Address.findOne({user:req.user.id});
    if(userAddress){
        userAddress.address = address;
        userAddress.country = country;
        userAddress.city = city;
        userAddress.phoneNo = phoneNo;
        userAddress.postalCode = postalCode;
        await userAddress.save();
        res.status(201).send({
            success : true,
            address : userAddress
        })
    }
    userAddress = await Address.create({
        user : req.user.id,
        address,
        country,
        city,
        phoneNo,
        postalCode
    });
    if(!userAddress){
        return next(new ErrorHandler('Address not found', 404));
    }
    res.status(201).send({
        success : true,
        address : userAddress
    });
});

exports.getAddress = catchAsyncError(async(req, res, next) => {
    const address = await Address.findOne({user:req.user.id});
    if(!address){
        return next(new ErrorHandler('Address not found', 404));
    }
    res.status(201).send({
        success : true,
        address
    });
});

exports.updateAddress = catchAsyncError(async(req, res, next) => {
    let address = await Address.findOne({user:req.user.id});
    if(!address){
        return next(new ErrorHandler('Address not found', 404));
    }
    address = await Address.findOneAndUpdate({
        user : req.user.id
    },req.body, {
        new : true,
        runValidators : true
    });

    res.status(201).send({
        success : true,
        address
    });
});

exports.getAllAddress = catchAsyncError(async(req, res, next) => {
    const addresses = await Address.find();
    if(addresses.length == 0){
        return next(new ErrorHandler('Addresses not found', 404));
    }
    res.status(200).send({
        success : true,
        addresses
    });
});