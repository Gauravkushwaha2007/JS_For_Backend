const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const sendmail = require('../utils/mailer');
const orderModel = require('../models/orderModel');

// 1. REGISTER USER
const registerUser = async (req, res)=>{
    try{
        let {name, email, password, contact} = req.body;
    
        let registeredUser = await userModel.findOne({email});
        if(registeredUser){
            return res.send('Already registered with this email');
        }
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        
        let user = await userModel.create({
            name,
            email, 
            password: hash,
            contact
        });
        
        let token = generateToken(user);
        res.cookie('token', token,{
            httpOnly: true,
            secure: false
        });
        
        await sendmail(user.email,
            "Welcome Dost",
            `<h2> Hellow ${user.name} </h2>
            <h3> kaise ho dost Ye mega fist trial hai </h3>`
        );
        
        return res.redirect('/products/allProducts');
        
    }
    catch(error){
        return res.status(500).send('Something went wrong');
    }
};

// 2. LOGIN USER (Fixed 🌟)
const loginUser = async (req, res)=>{
    try{
        let {email, password} = req.body;
        let user = await userModel.findOne({email});
        if(!user) {
            return res.send('User not found');
        }
        
        let isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.send('Email or password is wrong');
        }
        //create token and set cookie
        let token = generateToken(user);
        res.cookie('token', token,{
            secure: false,
            httpOnly: true
        });

        return res.redirect('/products/allProducts');
    }
    catch(error){
        console.log(error.message);
        return res.send('Some wrong');
    }
};


// 3. ADD TO CART
const addToCart = async (req, res)=>{
    try{
        const userEmail = req.user ? req.user.email : jwt.verify(req.cookies.token, process.env.JWT_SECRET).email;
        
        let user = await userModel.findOne({email: userEmail});
        let product = await productModel.findById(req.params.productId);
        
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
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
        
        res.json({
            success: true,
            message: "Added to Cart"
        });
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ success: false, message: "Some Wrong" });
    }
};

// 4. REMOVE FROM CART
const removeToCart = async (req, res)=>{
    try{
        const userEmail = req.user ? req.user.email : jwt.verify(req.cookies.token, process.env.JWT_SECRET).email;
        const user = await userModel.findOne({email: userEmail});
        
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

// 5. CART PRODUCTS PAGE
const cartProducts = async (req, res)=>{
    try{
        const userEmail = req.user ? req.user.email : jwt.verify(req.cookies.token, process.env.JWT_SECRET).email;
        let user = await userModel.findOne({email: userEmail}).populate('cart.product');

        if(!user){
            return res.redirect('/users/login');
        }

        user.cart = user.cart.filter(item => item.product !== null);
        await user.save();

        let products = user.cart;
        res.render('cartProducts', {products: products, user: user});

    }
    catch (error) {
        console.error("Cart Controller Error:", error.message);
        res.status(500).send("Server Error");
    }
};


// 6. DECREASE QUANTITY
const descreaseQty = async (req, res)=>{
    try{
        const userEmail = req.user ? req.user.email : jwt.verify(req.cookies.token, process.env.JWT_SECRET).email;
        let user = await userModel.findOne({email: userEmail}).populate('cart.product');
        let productId = req.params.productId;
        
        let cartItem = user.cart.find(item => item.product._id.toString() === productId);

        if(!cartItem){
            return res.status(403).json({ success: false, message: "Product not found" });
        }

        if(cartItem.quantity > 1){
            cartItem.quantity -= 1;
            await user.save();
        }

        return res.json({
            success: true,
            quantity: cartItem.quantity
        });  
    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: 'Some wrong...' });
    }
};

// 7. INCREASE QUANTITY
const increaseQty = async (req, res)=>{
    try{
        const userEmail = req.user ? req.user.email : jwt.verify(req.cookies.token, process.env.JWT_SECRET).email;
        let user = await userModel.findOne({email: userEmail}).populate('cart.product');
        let productId = req.params.productId;
    
        let cartItem = user.cart.find(item => item.product._id.toString() === productId);
        
        if(cartItem){
            cartItem.quantity += 1;
            await user.save();
    
            return res.json({
                success: true,
                quantity: cartItem.quantity
            });
        }   
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: 'Some wrong...' });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('token');
    req.flash('Success', "Logged out Successfully ")
    res.redirect('/users/login')
}


// CART CHECKOUT 
const cartCheckout = async (req, res) => {
    try {
        // 1. कार्ट के प्रोडक्ट्स को पॉपुलेट करो ताकि टोटल प्राइस निकाल सकें
        const user = await userModel.findById(req.user._id).populate('cart.product');
        
        if (!user || user.cart.length === 0) {
            return res.status(400).send("Your cart is empty!");
        }

        let totalCartPrice = user.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        
        const orderProducts = user.cart.map(item => ({
            product: item.product._id, 
            quantity: item.quantity,
        }));

        let newOrder = await orderModel.create({
            user: user._id,
            products: orderProducts,   
            totalPrice: totalCartPrice,
            address: req.body.address,
            
        });
    
        user.cart = [];
        await user.save();
    
        res.redirect('/users/orders');
    }
    
    catch (error) {
        console.error("Critical Checkout Error:", error.message, error);
        res.status(500).send("Something went wrong while placing the order.");
    }
};

const getOrders = async (req, res)=>{
    try {
        let orders = await orderModel.find({ user: req.user._id })
                                     .populate('products.product')
                                     .sort({ createdAt: -1 }); 

        res.render('orders', { orders, user: req.user });
    } catch (error) {
        res.status(500).send("Error fetching orders");
    }
}

module.exports = {
    registerUser, loginUser, addToCart, cartProducts, removeToCart, increaseQty, descreaseQty, logoutUser, cartCheckout, getOrders
};