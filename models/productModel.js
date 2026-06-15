const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name must be provided"],
        minlength: [2, "Name must be at least 2 characters"],
        trim: true
    },
    image: {
        type: String,
        default: 'default-product.png' // 🎯 खाली स्ट्रिंग की जगह डिफ़ॉल्ट इमेज का नाम रखना सेफ है
    },
    images: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: [true, "Base retail price is required"],
        min: [0, "Price cannot be negative"]
    },
    stock: {
        type: Number,
        default: 10,
        min: [0, "Stock cannot be less than 0"] // 🎯 स्टॉक कभी माइनस में नहीं जाना चाहिए
    },
    quantity: {
        type: String,
        required: [true, "Quantity metric (e.g., 1 kg, 500 ml) is required"],
        trim: true
    },
    category: {
        type: String, 
        required: [true, "Product category/department is required"],
        lowercase: true, // 🎯 ताकि 'Dairy' और 'dairy' में डेटाबेस कंफ्यूज न हो
        trim: true
    },
    bgColor: {
        type: String,
        default: "#ffffff"
    },
    panelColor: {
        type: String,
        default: "#f3f4f6" 
    },
    textColor: {
        type: String,
        default: "#111827"
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be less than 0"],
        validate: {
            validator: function(value) {
                return value <= this.price;
            },
            message: "Discount amount ({VALUE}) cannot be greater than the product price!"
        }
    },
    description: {
        type: String,
        trim: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('product', productSchema);