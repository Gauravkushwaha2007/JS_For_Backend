const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product' 
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],  
    orders: {
        type: Array,
        default: []
    },
    picture: String,
    contact: Number,

    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    
    addresses: [{
        title: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
        flatNo: { type: String, required: true }, 
        area: { type: String, required: true },
        landmark: { type: String, default: "" },
        city: { type: String, required: true }, 
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    }],

});

module.exports = mongoose.model('user', userSchema);