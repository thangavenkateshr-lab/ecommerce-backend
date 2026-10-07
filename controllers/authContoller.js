const crypto = require('crypto');
const catchAsyncError = require("../middwares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require("../utils/jwt");
const sendEmail = require('../utils/email');

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    });
    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Enter email and password', 401))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHandler('Invalid email or password'))
    }
    const isMatched = await user.isValidPassword(password);
    if (!isMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }
    sendToken(user, 201, res)
})

exports.logoutUser = (req,res,next) => {
    res.cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly : true
    })
    .status(201)
    .send({
        success : true,
        message : "Logged out"
    })
}

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler('User not found with this email',404))
    }
    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave:false})
    //create reset url
    const resetUrl = `${process.env.FRONT_END_URI}/password/reset/${resetToken}`
    //create message
    const message = `Your password reset url is as follows \n\n
    ${resetUrl} \n\n If you have not requested this e-mail,  then ignored it`
    try{
        await sendEmail({
            email : user.email,
            subject : "Money cart recovery",
            message
        })
        res.status(201).send({
            success : true,
            message : `Email send to ${user.email}`
        })
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save({validateBeforeSave : false});
        return next(new ErrorHandler(error.message,500))
    }
})

exports.resetPassword = catchAsyncError(async(req,res,next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpiry : {
            $gt : Date.now()
        }
    })
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or expired',404))
    }
    if(!req.body.password || !req.body.confirmPassword){
        return next(new ErrorHandler('Enter an password and confirm Password', 402));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',402));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save({validateBeforeSave:false});
    sendToken(user,201,res);
})

exports.userProfile = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler('User not found',404));
    }
    res.status(201).send({
        success : true,
        user
    })
})

exports.changePassword = catchAsyncError(async(req,res,next) => {
    if(!req.body.oldPassword || !req.body.newPassword){
        return next(new ErrorHandler('Enter old password and new password'));
    }
    const user = await User.findById(req.user.id).select('+password');
    if(!user){
        return next(new ErrorHandler('User not found',404));
    }
    const matched = await user.isValidPassword(req.body.oldPassword);
    if(!matched){
        return next(new ErrorHandler('old Password does not  correct',402))
    }
    user.password = req.body.newPassword;
    await user.save({validateBeforeSave:false});
    res.status(201).send({
        success : true,
        message : 'Password changed successfully'
    })
})

exports.updateProfile = catchAsyncError(async(req,res,next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new : true
    })

    res.status(201).send({
        success : true,
        user
    })
})

exports.allUsers = catchAsyncError(async(req,res,next) => {
    const user = await User.find();
    res.status(201).send({
        success : true,
        user
    })
})

exports.singleUser = catchAsyncError(async(req,res,next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user){
        return next(new ErrorHandler('User not found',404));
    }
    res.status(201).send({
        success : true,
        user
    })
})

exports.updateUser = catchAsyncError(async(req,res,next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id);
    await user.save();
    res.status(201).send({
        success : true,
        user
    })
})

exports.deleteUser = catchAsyncError(async(req,res,next) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    res.status(201).send({
        success : true,
        message : 'User deleted successfully'
    })
})