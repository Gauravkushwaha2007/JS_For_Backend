const express = require('express');
const adminRouter = express.Router();
const orderModel = require('../models/orderModel');
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// एडमिन का होम पेज (सारे ऑर्डर्स यहाँ दिखेंगे)
adminRouter.get('/orders', isAdmin, async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('user')                    
            .populate('products.product'); 

        res.render('adminOrders', { orders, user: req.user, activePage: 'liveOrders' });
    } catch (err) {
        console.error("Admin Orders Error:", err);
        res.status(500).send("Server Error");
    }
});

// स्टेटस अपडेट करने का पावर बटन
adminRouter.post('/orders/update/:id', isLoggedIn, isAdmin, async (req, res) => {
    let { status } = req.body; // 'Dispatched' या 'Delivered'
    await orderModel.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/orders');
});

module.exports = adminRouter;