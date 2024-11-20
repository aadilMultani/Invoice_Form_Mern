// routes/invoiceRoutes.js
const express = require('express');
const { createInvoice } = require('../controller/invoiceController');

const router = express.Router();

router.post('/invoices', createInvoice);

module.exports = router;