const express = require('express');
const { getDentists, getDentist, createDentist, updateDentist, deleteDentist} = require('../controllers/Dentists');

const router = express.Router();

router.route('/').get(getDentists).post(createDentist);
router.route('/:id').get(getDentist).put(updateDentist).delete(deleteDentist);

module.exports = router;