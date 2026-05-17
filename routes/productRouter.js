const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const productModel = require('../models/productModel')
const {createProduct, deleteProduct, getEditProduct, postEditProduct} = require('../controllers/productController')
const upload = require('../config/multer')

const productRouter = express.Router();

productRouter.get('/allProducts', async(req, res)=>{
    let products = await productModel.find();
    res.render('allProducts', {products: products});
});

productRouter.get('/product', isLoggedIn, (req, res)=>{
    res.send('A single product');
});

productRouter.get('/create', isLoggedIn, (req, res)=>{
    res.render('createProduct',{product: null});
})

productRouter.post('/create', upload.single('image'), createProduct);

productRouter.post('/delete/:id', isLoggedIn, deleteProduct)

productRouter.get('/edit/:id', isLoggedIn, getEditProduct)
productRouter.post('/edit/:id', isLoggedIn, upload.single('image'), postEditProduct)


module.exports = productRouter;