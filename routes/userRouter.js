const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware')
const {
    registerUser, loginUser, addToCart, cartProducts, removeToCart, increaseQty, descreaseQty
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', (req, res)=>{
    // res.flash("erorr", "Yo are gaurav")
    res.send('User page');
});

userRouter.get('/register', (req,res)=>{
    res.render('register');
});
userRouter.post('/register', registerUser);


userRouter.get('/login', (req, res)=>{
    res.render('login');
});
userRouter.post('/login', loginUser);


userRouter.post('/cart/add-to-cart/:productId', isLoggedIn, addToCart);
userRouter.post('/cart/remove-product/:productId', isLoggedIn, removeToCart)
userRouter.get('/cart/products', isLoggedIn, cartProducts)

userRouter.post('/cart/update/increaseQty/:productId',isLoggedIn, increaseQty);
userRouter.post('/cart/update/descreaseQty/:productId', isLoggedIn, descreaseQty);

module.exports = userRouter;