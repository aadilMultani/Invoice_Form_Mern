const Product = require('../models/Product');
const TryCatch = require('../middleware/tryCatch');
const ErrorHandler = require('../utils/errorHandler');

exports.getProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find();

    if (!products) {
        return next(new ErrorHandler("Product not Found !", 404));
    }

    return res.json(products);
});