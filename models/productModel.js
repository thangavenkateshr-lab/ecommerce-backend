const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please enter the product name"],
        trim : true,
        maxLength : [200,"Product name can't exceed 100 characters"]
    },
    price : {
        type : Number,
        required : [true,"Please enter the product price"],
    },
    description : {
        type : String,
        required : [true,"Please enter the product description"]
    },
    ratings : {
        type : String,
        default : 0
    },
    images : [
        {
            file_name : {
                required : [true,"Please enter the image"],
                type : String
            }   
        }
    ],
    category : {
        type : String,
        required : [true,"Please enter the product category"],
        enum : {
            values : [
                'Dress',
                'Laptops',
                'Watches',
                'Shoes',
                'Mobiles',
                'Speakers',
            ],message : "Please select the correct category"
        }
    },
    stock : {
        type : Number,
        required : [true,"Please enter the product stock"],
        maxLength : [20,"Product must not exceed 20"]
    },
    noOfReviews : {
        type : Number,
        default : 0
    },
    reviews : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            },
            ratings : {
                type : String,
                required : true
            },
            comments : {
                type : String,
                required : true
            }
        }
    ],
    user : {
        type : mongoose.Schema.Types.ObjectId
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

const productModel = mongoose.model('Product',productSchema)

module.exports = productModel;