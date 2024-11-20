const InvoiceMaster = require('../models/InvoiceMaster');
const InvoiceDetail = require('../models/InvoiceDetail');

exports.createInvoice = async (req, res) => {
    const { customerName, invoiceDetails } = req.body;

    try {
        const lastInvoice = await InvoiceMaster.findOne().sort({ Invoice_no: -1 });
        const newInvoice = new InvoiceMaster({
            Invoice_no: (lastInvoice ? lastInvoice.Invoice_no : 0) + 1,
            CustomerName: customerName,
            TotalAmount: invoiceDetails.reduce((sum, detail) => sum + detail.TotalAmount, 0),
        });

        await newInvoice.save();

        for (let detail of invoiceDetails) {
            const invoiceDetail = new InvoiceDetail({
                Invoice_Id: newInvoice._id,
                Product_Id: detail.Product_Id,
                Rate: detail.Rate,
                Unit: detail.Unit,
                Qty: detail.Qty,
                Disc_Percentage: detail.Disc_Percentage,
                NetAmount: detail.NetAmount,
                TotalAmount: detail.TotalAmount,
            });
            await invoiceDetail.save();
        }

        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};