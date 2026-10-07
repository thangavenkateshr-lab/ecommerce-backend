const express = require('express');
const { createOrder, singleOrder, myOrder, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middwares/authenticate');
const router = express.Router();

router.route('/order/create').post(isAuthenticatedUser , createOrder);
router.route('/order/:id').get(isAuthenticatedUser, singleOrder);
router.route('/myorder').get(isAuthenticatedUser, myOrder);
router.route('/get/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/update/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);
router.route('/delete/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteOrder);

module.exports = router;