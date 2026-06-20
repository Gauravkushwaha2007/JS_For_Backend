const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const {
    registerUser, loginUser, logoutUser, verifyOtp, getVerifyOtpPage,
    forgotPassword, getResetPassword, postResetPassword
} = require('../controllers/authController');

const {
    addToCart, cartProducts, removeToCart, increaseQty, descreaseQty, cartCheckout
} = require('../controllers/cartController');

const {
    getOrders, getBill
} = require('../controllers/orderController');

const {
    getProfile, updateProfile, addAddress, deleteAddress, editAddress, makeAddressPrimary, fetchAddressFromGoogle
} = require('../controllers/profileController');

const userRouter = express.Router();

userRouter.get('/register', (req, res)=>{
    res.render('auth/register', { error: null });
});
userRouter.post('/register', registerUser);

userRouter.get('/verify-otp', getVerifyOtpPage);
userRouter.post('/verify-otp', verifyOtp);

userRouter.get('/login', (req, res)=>{
    res.render('auth/login', { error: null });
});
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);

userRouter.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', { message: null, type: null });
});
userRouter.post('/forgot-password', forgotPassword);
userRouter.get('/reset-password/:token', getResetPassword);
userRouter.post('/reset-password/:token', postResetPassword);

userRouter.get('/cart/products', isLoggedIn, cartProducts);
userRouter.post('/cart/add-to-cart/:productId', isLoggedIn, addToCart);
userRouter.post('/cart/remove-product/:productId', isLoggedIn, removeToCart);
userRouter.post('/cart/update/increaseQty/:productId', isLoggedIn, increaseQty);
userRouter.post('/cart/update/descreaseQty/:productId', isLoggedIn, descreaseQty);
userRouter.post('/cart/checkout', isLoggedIn, cartCheckout);

userRouter.get('/orders', isLoggedIn, getOrders);
userRouter.get('/orders/bill/:orderId', isLoggedIn, getBill);

userRouter.get('/profile', isLoggedIn, getProfile);
userRouter.post('/profile/update', isLoggedIn, updateProfile);
userRouter.post('/profile/address/add', isLoggedIn, addAddress);
userRouter.get('/profile/address/fetch-address', isLoggedIn, fetchAddressFromGoogle);
userRouter.post('/profile/address/delete/:addressId', isLoggedIn, deleteAddress);
userRouter.post('/profile/address/edit/:addressId', isLoggedIn, editAddress);
userRouter.post('/profile/address/default/:addressId', isLoggedIn, makeAddressPrimary);

module.exports = userRouter;
