const express = require('express');
const transactionController = require('../../controllers/transactionController')
const router = express.Router();


router.get('/:id', transactionController.getTransactionById);
router.get('/', transactionController.getAllTransactions);
router.delete('/:id', transactionController.deleteTransactionById);




module.exports = router;