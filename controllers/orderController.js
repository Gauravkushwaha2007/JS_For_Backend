const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

// GET ORDERS
const getOrders = async (req, res) => {
    try {
        const currentUser = await userModel.findById(req.user._id).populate('cart.product');
        
        let totalCartPrice = 0;
        if (currentUser && currentUser.cart && currentUser.cart.length > 0) {
            totalCartPrice = currentUser.cart.reduce((acc, item) => {
                if (item.product && item.product.price) {
                    return acc + (item.product.price * item.quantity);
                }
                return acc;
            }, 0);
        }

        let orders = await orderModel.find({ user: req.user._id })
                                     .populate('products.product')
                                     .sort({ createdAt: -1 }); 

        const isOrderSuccess = req.query.success === 'true';

        res.render('orders', { 
            orders, 
            user: currentUser,
            totalCartPrice,
            orderSuccessMessage: isOrderSuccess ? "Your order has been placed successfully! Track your order below." : null
        });

    } catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).render('error', {
            status: 500,
            message: "Orders Retrieval Failed",
            detail: "We encountered an unexpected error while retrieving your order tracking history.",
            buttonText: "Go Back Home",
            buttonLink: "/"
        });
    }
};

// GET BILL
const getBill = async (req, res)=>{
    try {
        const order = await orderModel.findById(req.params.orderId).populate('user').populate('products.product');
        
        if (!order) {
            return res.status(404).render('error', {
                status: 404,
                message: "Order Invoice Not Found",
                detail: "The invoice you are searching for does not exist or has been deleted.",
                buttonText: "My Orders",
                buttonLink: "/users/orders"
            });
        }

        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).render('error', {
                status: 403,
                message: "Unauthorized Invoice Access",
                detail: "You do not have permission to view or print this order invoice.",
                buttonText: "My Orders",
                buttonLink: "/users/orders"
            });
        }

        let subtotal = order.totalPrice; 
        let deliveryCharge = subtotal > 500 ? 0 : 29; // 500 से ऊपर फ्री डिलीवरी
        let gst = Math.round(subtotal * 0.05); // 5% GST
        let finalBillAmount = subtotal + deliveryCharge;

        res.render('bill', { 
            user: req.user, 
            order, 
            subtotal, 
            deliveryCharge, 
            gst, 
            finalBillAmount 
        });

    } catch (error) {
        console.log('Error from userController getBill function ', error.message, error);
        res.status(500).render('error', {
            status: 500,
            message: "Invoice Generation Error",
            detail: "An unexpected error occurred while preparing your invoice billing statement.",
            buttonText: "My Orders",
            buttonLink: "/users/orders"
        });
    }
};

// GET LIVE ORDERS STATUS (JSON API)
const getOrdersStatus = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id }, { _id: 1, status: 1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getOrdersStatus:", error);
        res.status(500).json({ success: false, message: "Failed to load order statuses" });
    }
};

module.exports = {
    getOrders,
    getBill,
    getOrdersStatus
};
