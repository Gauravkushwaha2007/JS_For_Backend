const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');
const sendmail = require('../utils/mailer');
const ejs = require('ejs');
const path = require('path');

const getBaseUrl = (req) => {
    return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
};

const getCartSummary = (user) => {
    let totalItems = 0;
    let totalCartPrice = 0;

    if (!user || !user.cart) {
        return { totalItems, totalCartPrice };
    }

    user.cart.forEach((item) => {
        if (!item.product) return;

        const quantity = Number(item.quantity || 1);
        const price = Number(item.product.price || 0);

        totalItems += 1;
        totalCartPrice += price * quantity;
    });

    return { totalItems, totalCartPrice };
};

// ADD TO CART
const addToCart = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id);
        let product = await productModel.findById(req.params.productId);
        
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock <= 0) {
            return res.json({
                success: false,
                message: "Product is out of stock"
            });
        }

        if(user.cart.some((i)=> i.product.toString() === product._id.toString())){
            return res.json({
                success: false,
                message: "Already in Cart"
            });
        }
        
        user.cart.push({
            product: product._id,
            quantity: 1
        });
        await user.save();

        user = await userModel.findById(user._id).populate('cart.product');
        
        res.json({
            success: true,
            message: "Added to Cart",
            cartSummary: getCartSummary(user)
        });
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ success: false, message: "Some Wrong" });
    }
};

// REMOVE FROM CART
const removeToCart = async (req, res)=>{
    try{
        const user = await userModel.findById(req.user._id);
        
        if(!user){
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        
        res.json({
            success: true,
            message: "Removed from cart"
        });
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// CART PRODUCTS PAGE
const cartProducts = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id).populate('cart.product');

        if(!user){
            return res.redirect('/users/login');
        }
        let totalCartPrice = 0;
        const populatedUser = await userModel.findById(user._id).populate('cart.product');
        
        if (populatedUser && populatedUser.cart) {
            user.cart = populatedUser.cart.filter(item => item.product !== null);
            
            user.cart.forEach(item => {
                if (item.product && item.product.price) {
                    totalCartPrice += (Number(item.product.price) * Number(item.quantity || 1));
                }
            });
        }

        user.cart = user.cart.filter(item => item.product !== null);
        await user.save();

        let products = user.cart;
        res.render('cartProducts', {
            products: products, 
            user: user, 
            addresses: user.addresses,
            totalCartPrice: totalCartPrice
        });

    }
    catch (error) {
        console.error("Cart Controller Error:", error.message);
        res.status(500).render('error', {
            status: 500,
            message: "Basket Retrieval Error",
            detail: "We were unable to load your shopping basket. Please try again.",
            buttonText: "Return to Store",
            buttonLink: "/"
        });
    }
};

// DECREASE QUANTITY
const descreaseQty = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id).populate('cart.product');
        let productId = req.params.productId;
        
        let cartItem = user.cart.find(item => item.product._id.toString() === productId);

        if(!cartItem){
            return res.status(403).json({ success: false, message: "Product not found" });
        }

        if(cartItem.quantity > 1){
            cartItem.quantity -= 1;
            await user.save();
        }

        user = await userModel.findById(user._id).populate('cart.product');

        return res.json({
            success: true,
            quantity: cartItem.quantity,
            cartSummary: getCartSummary(user)
        });  
    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: 'Some wrong...' });
    }
};

// INCREASE QUANTITY
const increaseQty = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id).populate('cart.product');
        let productId = req.params.productId;
    
        let cartItem = user.cart.find(item => item.product._id.toString() === productId);
        
        if(cartItem){
            if (cartItem.quantity >= cartItem.product.stock) {
                return res.json({ success: false, isStockError: true, message: `Sorry, only ${cartItem.product.stock} units available.` });
            }

            cartItem.quantity += 1;
            await user.save();

            user = await userModel.findById(user._id).populate('cart.product');
    
            return res.json({
                success: true,
                quantity: cartItem.quantity,
                cartSummary: getCartSummary(user)
            });
        }   
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: 'Some wrong...' });
    }
};

// CART CHECKOUT 
const cartCheckout = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate('cart.product');
        
        if (!user || user.cart.length === 0) {
            return res.status(400).render('error', {
                status: 400,
                message: "Empty Basket",
                detail: "Your shopping basket is currently empty. Add some products before checking out.",
                buttonText: "Shop Now",
                buttonLink: "/"
            });
        }

        for (let item of user.cart) {
            if (!item.product) {
                return res.status(400).render('error', {
                    status: 400,
                    message: "Product Unavailable",
                    detail: "One of the products in your basket is no longer available. Please remove it and try again.",
                    buttonText: "Go to Basket",
                    buttonLink: "/users/cart/products"
                });
            }
            if (item.product.stock < item.quantity) {
                return res.status(400).render('error', {
                    status: 400,
                    message: "Insufficient Stock",
                    detail: `Sorry, only ${item.product.stock} units of "${item.product.name}" are left in stock. Please reduce the quantity in your basket.`,
                    buttonText: "Go to Basket",
                    buttonLink: "/users/cart/products"
                });
            }
        }

        let totalCartPrice = user.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        
        const orderProducts = user.cart.map(item => ({
            product: item.product._id, 
            quantity: item.quantity,
        }));

        const deliveryAddress = req.body.address || "Main Address";

        let newOrder = await orderModel.create({
            user: user._id,
            products: orderProducts,   
            totalPrice: totalCartPrice,
            address: deliveryAddress,
        });
        // Update stock atomically and verify success
        const updatedProducts = [];
        try {
            for (let item of user.cart) {
                const updatedProduct = await productModel.findOneAndUpdate(
                    { _id: item.product._id, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
                if (!updatedProduct) {
                    throw new Error(`Insufficient stock for "${item.product.name}"`);
                }
                updatedProducts.push({ product: item.product, quantity: item.quantity });
            }
        } catch (stockError) {
            // Rollback successful updates if one of them failed
            for (let rolled of updatedProducts) {
                await productModel.findByIdAndUpdate(rolled.product._id, {
                    $inc: { stock: rolled.quantity }
                });
            }
            return res.status(400).render('error', {
                status: 400,
                message: "Stock Depleted",
                detail: stockError.message || "We encountered a stock conflict. Please check your basket and try again.",
                buttonText: "Go to Basket",
                buttonLink: "/users/cart/products"
            });
        }

        user.cart = [];
        await user.save();
    
        try {
            const templatePath = path.join(__dirname, '../views/emails/orderSuccess.ejs');
            const orderHtml = await ejs.renderFile(templatePath, {
                userName: user.name,
                orderId: newOrder._id,
                totalPrice: totalCartPrice,
                address: deliveryAddress,
                hostUrl: getBaseUrl(req)
            });

            await sendmail(
                user.email,
                `🛒 KUSH MART - Order Confirmed! (ID: ${newOrder._id.toString().slice(-6).toUpperCase()})`,
                orderHtml
            );
        } catch (mailError) {
            console.error("Order Mail Failed:", mailError.message);
        }

        res.redirect('/users/orders?success=true');
    }
    catch (error) {
        console.error("Critical Checkout Error:", error.message, error);
        res.status(500).render('error', {
            status: 500,
            message: "Order Placement Failed",
            detail: "We encountered a critical error while processing your order checkout. Please contact support if the issue persists.",
            buttonText: "Return to Basket",
            buttonLink: "/users/cart/products"
        });
    }
};

// GET CART DATA (JSON API)
const getCartData = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        // Filter out null products
        user.cart = user.cart.filter(item => item.product !== null);
        
        let totalCartPrice = 0;
        user.cart.forEach(item => {
            if (item.product && item.product.price) {
                totalCartPrice += (Number(item.product.price) * Number(item.quantity || 1));
            }
        });

        res.json({
            success: true,
            products: user.cart,
            totalCartPrice
        });
    } catch (error) {
        console.error("getCartData Error:", error);
        res.status(500).json({ success: false, message: "Failed to load cart data" });
    }
};

module.exports = {
    addToCart,
    removeToCart,
    cartProducts,
    descreaseQty,
    increaseQty,
    cartCheckout,
    getCartData
};
