const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

// Nested route logic mapping explicit vendor links
router.post('/:vendorId/ledger', ledgerController.addLedgerEntry);

module.exports = router;