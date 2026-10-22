const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);

module.exports = router;