const mongoose = require('mongoose');

const InvoiceMasterSchema = new mongoose.Schema({
    Invoice_no: {
        type: Number,
        required: true
    },
    Invoice_Date: {
        type: Date,
        default: Date.now
    },
    CustomerName: {
        type: String,
        required: true
    },
    TotalAmount: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('InvoiceMaster', InvoiceMasterSchema);