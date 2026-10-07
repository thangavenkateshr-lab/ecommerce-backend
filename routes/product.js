const express = require('express');
const { newProduct, getProduct, singleProduct, updateProduct, deleteProduct, createReviews, getReviews, deleteReviews } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middwares/authenticate');
const router = express.Router();
router.route('/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);
router.route('/products').get(getProduct);
router.route('/product/:id')
                                         .get(singleProduct)
                                         .put(updateProduct)
                                         .delete(deleteProduct);
router.route('/create/reviews').post(isAuthenticatedUser, createReviews);
router.route('/get/reviews').get(getReviews);
router.route('/delete/review').delete(isAuthenticatedUser, deleteReviews);
module.exports = router;