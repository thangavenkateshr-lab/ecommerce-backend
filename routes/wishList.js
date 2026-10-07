const express = require('express');
const { createWishList, getWishLists, deleteWishList } = require('../controllers/wishListController');
const { isAuthenticatedUser } = require('../middwares/authenticate');
const router = express.Router();

router.route('/create/wishlist').post(isAuthenticatedUser, createWishList);
router.route('/wishlists').get(isAuthenticatedUser, getWishLists);
router.route('/delete/wishlist/:id').delete(isAuthenticatedUser, deleteWishList);

module.exports = router;