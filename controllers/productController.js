const catchAsyncError = require('../middwares/catchAsyncError');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
exports.getProduct = async(req,res,next) =>{
    const resPerPage = 5;
    const apiFeature = new APIFeatures(Product.find(),req.query).search().filter();
    const products = await apiFeature.query;
    if(!products){
    return next(new ErrorHandler('Unable to send products',404));
    }
    res.status(200).send({
        Success : true,
        count : products.length,
        products
    })
}
exports.newProduct = catchAsyncError(async(req,res,next) =>{
    req.body.user = req.user.id;
    const product =await Product.create(req.body)
    res.status(201).send({
        Success : true,
        product
    })
})

exports.singleProduct = async(req,res,next) =>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404));
    }
    let similarProducts = await Product.find({category:product.category});
    similarProducts = similarProducts.filter((similarProduct)=>{
        return similarProduct.id.toString() !== product.id.toString();
    })
    res.status(201).send({
        success : true,
        product,
        similarProducts
    })
}

exports.updateProduct = async(req,res,next) =>{
    let product = await Product.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler('Products not found',404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true
    })
    res.status(201).send({
        success : true,
        product
    })
}

exports.deleteProduct = async(req,res,next) =>{
    const productId =await Product.findById(req.params.id)
    if(!productId){
      return next(new ErrorHandler('Products not found',404));
    }
    const product =await Product.findByIdAndDelete(req.params.id);
    res.status(201).send({
        success : true,
        productId
    })
}

exports.createReviews = catchAsyncError(async(req,res,next) => {
    const {productId,ratings,comments} = req.body;
    const review = {
        user : req.user.id,
        ratings,
        comments
    }
    const product = await Product.findById(productId);
    const reviewed = await product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString();
    })
    if(reviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.ratings = ratings,
                review.comments = comments
            }
        })
    }
    else{
        product.reviews.push(review);
        product.noOfReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc,review) => {
        return review.ratings+acc;
    },0)/product.reviews.length;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;
    await product.save({validateBeforeSave:false});
    res.status(201).send({
        success : true,
        message : "Review Added Successfully"
    })
})

exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user", "name email");
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

exports.deleteReviews = catchAsyncError(async(req,res,next) => {
    let product = await Product.findById(req.query.productId);
    const review = product.reviews.find(review => {
        return review._id.toString() == req.query.id.toString()
    })
    if(!review){
        return next(new ErrorHandler('Review not found',404))
    }
    if(review.user.toString() !== req.user.id.toString()){
        return next(new ErrorHandler('You have not delete the other reviews'))
    }
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString(); 
    })
    const noOfReviews = reviews.length;
    let ratings = product.reviews.reduce((acc,review) => {
        return review.ratings+acc;
    },0)/reviews.length;
    ratings = ratings ? 0 : ratings;
    product = await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        noOfReviews
    },{
        new : true
    });
    res.status(201).send({
        success : true,
        product
    })
})