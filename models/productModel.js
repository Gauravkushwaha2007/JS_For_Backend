const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    bgColor: String,
    panelColor: String,
    textColor: String,
    discount: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model('product', 'productSchema');