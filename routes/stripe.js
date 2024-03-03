const express = require('express');
const {getPrices, createPrice, createPaymentSession, paymentSuccess, paymentCancel} = require('../controllers/stripe');
const {protect,authorize} = require('../middleware/auth');

const router = express.Router();

router.get("/success", paymentSuccess);
router.get("/cancel", paymentCancel);

router.route('/session')
    .post(protect, authorize('admin','user'), createPaymentSession);

router.route('/')
    .post(protect, authorize('admin'), createPrice)
    .get(protect, authorize('admin'), getPrices);
    

module.exports = router