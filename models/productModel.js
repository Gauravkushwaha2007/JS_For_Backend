const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name must be provided"],
        minlength: [2, "Name must atleast 2 character"],
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 10
    },
    quantity: {
        type: String,
        required: true
    },
    category: {
        type: String, 
        required: true
    },

    bgColor: {
        type: String,
        default: "#ffff"
    },
    panelColor: {
        type: String,
        default: "#f3f4f6"
    },
    textColor: {
        type: String,
        default: "#0000"
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, "Discount can't be less 0"]
    },
    description: {
        type: String
    }


}, {
    timestamps: true
});


module.exports = mongoose.model('product', productSchema);
