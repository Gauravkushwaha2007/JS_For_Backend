const express = require('express');
const adminRouter = express.Router();
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel'); 
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

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

adminRouter.post('/orders/update/:id', isLoggedIn, isAdmin, async (req, res) => {
    let { status } = req.body; // 'Dispatched' या 'Delivered'
    await orderModel.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/orders');
});


// getAnalytics Dashboard 
adminRouter.get('/analytics', isAdmin, async (req, res) =>{
    try {
        const allOrders = await orderModel.find().populate('products.product');
        const totalOrders = allOrders.length;
        let totalRevenue = allOrders.reduce((acc, order) => acc + order.totalPrice, 0);

        const monthlySales = Array(12).fill(0);
        allOrders.forEach(order => {
            const month = new Date(order.createdAt).getMonth();
            monthlySales[month] += order.totalPrice;
        });

        const productCountMap = {};
        allOrders.forEach(order => {
            order.products.forEach(item => {
                if (item.product) {
                    const prodId = item.product._id.toString();
                    const prodName = item.product.name;
                    if (!productCountMap[prodId]) {
                        productCountMap[prodId] = { name: prodName, count: 0 };
                    }
                    productCountMap[prodId].count += item.quantity;
                }
            });
        });

        const topProducts = Object.values(productCountMap).sort((a, b) => b.count - a.count).slice(0, 5);
        const topProductNames = topProducts.map(p => p.name);
        const topProductCounts = topProducts.map(p => p.count);

        const lowStockProducts = await productModel.find({
            stock: { $lte: 5 } // $lte मतलब Less Than or Equal to 5
        }).select('name stock price image'); 

        res.render('admin/analytics', {
            totalOrders,
            totalRevenue,
            monthlySalesData: JSON.stringify(monthlySales),
            topProductNames: JSON.stringify(topProductNames),
            topProductCounts: JSON.stringify(topProductCounts),
            lowStockProducts, 
            user: req.user,
            activePage: 'analytics'
        });

    } catch (error) {
        console.error("Analytics Error:", error.message);
        res.status(500).send("Error fetching analytics data");
    }
});



module.exports = adminRouter;