const express = require('express');
const router = express.Router();
const {getCombinedData, getCategory, getPriceRange, getStatistics,  listTransactions} = require('../controllers/transactionController');





router.get('/transactions', listTransactions);


router.get('/statistics', getStatistics);


router.get('/bar-chart', getPriceRange);


router.get('/pie-chart', getCategory);


router.get('/combined-data', getCombinedData);

module.exports = router;
