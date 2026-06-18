const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// Standard RESTful route mapping
router.get('/', vendorController.getVendors);
router.get('/:id', vendorController.getVendorById);
router.patch('/:id/status', vendorController.updateVendorStatus);

router.post('/', vendorController.createVendor);

module.exports = router;