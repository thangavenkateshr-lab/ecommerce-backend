const express = require('express');
const { createAddress, getAddress, updateAddress, getAllAddress } = require('../controllers/addressController');
const { isAuthenticatedUser, authorizeRoles } = require('../middwares/authenticate');
const router = express.Router();

router.route('/create/address').post(isAuthenticatedUser, createAddress);
router.route('/address').get(isAuthenticatedUser, getAddress);
router.route('/update/address').put(isAuthenticatedUser, updateAddress);
router.route('/addresses').get(isAuthenticatedUser, authorizeRoles('admin'), getAllAddress);

module.exports = router;