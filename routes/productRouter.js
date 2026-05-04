const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const productModel = require('../models/productModel')
const {createProduct, deleteProduct} = require('../controllers/productController')
const upload = require('../config/multer')

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

productRouter.post('/create', upload.single('image'), createProduct);

productRouter.post('/delete/:id', isLoggedIn, deleteProduct)


module.exports = productRouter;