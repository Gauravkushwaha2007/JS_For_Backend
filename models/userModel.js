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
    contact: Number

})

module.exports = mongoose.model('user', userSchema);