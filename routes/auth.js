const express = require('express');
const {login, register, getMe, logout} = require('../controllers/auth');
const {protect} = require('../middleware/auth');
const router = express.Router();
const bookingRouter = require('./bookings');

router.use('/:authId/bookings',bookingRouter);

router.post('/register',register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.get('/logout',logout);

module.exports = router;