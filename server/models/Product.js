const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_Name: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Product', ProductSchema);