const express = require('express');

const purchaseFeatureController = require('../controller/purchaseFeature.controller');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', authenticatemiddleware.authenticate, purchaseFeatureController.purchasePremiumFeature);


module.exports = router;