const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    
    products: [{ 
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product' 
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    
    totalPrice: { 
        type: Number, 
        required: true 
    },
    
    address: { 
        type: String, 
        required: true 
    },
    
    status: { 
        type: String, 
        default: 'Pending',
        enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled']
    },
    
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('order', orderSchema);