const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter.get('/allProducts', (req, res)=>{
    res.render('allProducts');
});

productRouter.get('/product', isLoggedIn, (req, res)=>{
    res.send('A single product');
});

productRouter.get('/createProduct', (req, res)=>{
    res.render('createProduct');
})



module.exports = productRouter;