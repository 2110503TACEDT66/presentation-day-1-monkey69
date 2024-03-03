const express = require('express');
const { getDentists, getDentist, createDentist, updateDentist, deleteDentist } = require('../controllers/dentists.js');
const { protect, authorize} = require('../middleware/auth.js');

const bookingRouter = require('./bookings');

const router = express.Router();

router.use('/:dentistId/bookings', bookingRouter);

router.route('/')
    .get(protect, authorize('admin','user'),getDentists)
    .post(protect, authorize('admin'), createDentist);
router.route('/:id')
    .get(protect, authorize('admin','user'),getDentist)
    .put(protect, authorize('admin'), updateDentist)
    .delete(protect, authorize('admin'), deleteDentist);

module.exports = router;