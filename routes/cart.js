const express = require('express');
const { createCart, getCarts, deleteCart, updateCarts } = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middwares/authenticate');
const router = express.Router();

router.route('/create/cart').post(isAuthenticatedUser, createCart);
router.route('/carts').get(isAuthenticatedUser, getCarts);
router.route('/update/cart/:id').put(isAuthenticatedUser, updateCarts);
router.route('/delete/cart/:id').delete(isAuthenticatedUser, deleteCart);

module.exports = router;