const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const rateLimiter = require('../middlewares/rateLimiter');

const {
    registerUser, loginUser, logoutUser, verifyOtp, getVerifyOtpPage,
    forgotPassword, getResetPassword, postResetPassword
} = require('../controllers/authController');

const {
    addToCart, cartProducts, removeToCart, increaseQty, descreaseQty, cartCheckout, getCartData
} = require('../controllers/cartController');

const {
    getOrders, getBill, getOrdersStatus
} = require('../controllers/orderController');

const {
    getProfile, updateProfile, addAddress, deleteAddress, editAddress, makeAddressPrimary, fetchAddressFromGoogle
} = require('../controllers/profileController');

const userRouter = express.Router();

// Define Limiter: Max 15 auth requests per 5 minutes per IP
const authLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000, 
    max: 15, 
    message: "Aapne bohot zyaada attempts kar liye hain. Kripya 5 minutes baad dobara koshish karein."
});

userRouter.get('/register', (req, res)=>{
    res.render('auth/login', { mode: 'register', error: null });
});
userRouter.post('/register', authLimiter, registerUser);

userRouter.get('/verify-otp', getVerifyOtpPage);
userRouter.post('/verify-otp', authLimiter, verifyOtp);

userRouter.get('/login', (req, res)=>{
    res.render('auth/login', { mode: 'login', error: null });
});
userRouter.post('/login', authLimiter, loginUser);
userRouter.get('/logout', logoutUser);

userRouter.get('/forgot-password', (req, res) => {
    res.render('auth/login', { mode: 'forgot', error: null, message: null, type: null });
});
userRouter.post('/forgot-password', authLimiter, forgotPassword);
userRouter.get('/reset-password/:token', getResetPassword);
userRouter.post('/reset-password/:token', authLimiter, postResetPassword);

userRouter.get('/cart/products', isLoggedIn, cartProducts);
userRouter.post('/cart/add-to-cart/:productId', isLoggedIn, addToCart);
userRouter.post('/cart/remove-product/:productId', isLoggedIn, removeToCart);
userRouter.post('/cart/update/increaseQty/:productId', isLoggedIn, increaseQty);
userRouter.post('/cart/update/descreaseQty/:productId', isLoggedIn, descreaseQty);
userRouter.post('/cart/checkout', isLoggedIn, cartCheckout);
userRouter.get('/cart/data', isLoggedIn, getCartData);

userRouter.get('/orders', isLoggedIn, getOrders);
userRouter.get('/orders/status', isLoggedIn, getOrdersStatus);
userRouter.get('/orders/bill/:orderId', isLoggedIn, getBill);

userRouter.get('/profile', isLoggedIn, getProfile);
userRouter.post('/profile/update', isLoggedIn, updateProfile);
userRouter.post('/profile/address/add', isLoggedIn, addAddress);
userRouter.get('/profile/address/fetch-address', isLoggedIn, fetchAddressFromGoogle);
userRouter.post('/profile/address/delete/:addressId', isLoggedIn, deleteAddress);
userRouter.post('/profile/address/edit/:addressId', isLoggedIn, editAddress);
userRouter.post('/profile/address/default/:addressId', isLoggedIn, makeAddressPrimary);

module.exports = userRouter;
