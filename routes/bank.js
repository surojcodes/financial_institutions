const express = require('express');
const { createBank, getBanks, getBank, updateBank, deleteBank, uploadLogo } = require('../controller/bank');
const Bank = require('../model/Bank');
const advancedResults = require('../middlware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Bank, { path: 'category', select: 'title' }), getBanks).post(createBank);
router.route('/:id').get(getBank).put(updateBank).delete(deleteBank);
router.route('/:id/logo').put(uploadLogo);

module.exports = router;