const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/watchlist/toggle', authController.toggleWatchlist); // State tracking channel

module.exports = router;