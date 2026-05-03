const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const productModel = require('../models/productModel')
const {createProduct} = require('../controllers/productController')

const productRouter = express.Router();

productRouter.get('/allProducts', async(req, res)=>{
    let product = await productModel.find();
    res.render('allProducts', {products: product});
});

productRouter.get('/product', isLoggedIn, (req, res)=>{
    res.send('A single product');
});

productRouter.get('/create', isLoggedIn, (req, res)=>{
    res.render('createProduct');
})

productRouter.post('/create', createProduct);


module.exports = productRouter;