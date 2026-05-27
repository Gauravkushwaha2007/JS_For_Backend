const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const attachUser = require('../middlewares/attachUser');

const productModel = require('../models/productModel')
const {createProduct, deleteProduct, getEditProduct, postEditProduct} = require('../controllers/productController')
const upload = require('../config/multer');

const productRouter = express.Router();


//This is for everyOne, without logged in user can also see products
productRouter.get('/allProducts', attachUser, async(req, res)=>{
    let products = await productModel.find();
    res.render('allProducts', {
        products: products,
        user: res.locals.user
    });
});

productRouter.get('/product', attachUser, (req, res)=>{
    res.send('A single product');
});

productRouter.get('/create', attachUser, isAdmin, (req, res)=>{
    res.render('createProduct',{product: null});
})

productRouter.post('/create', attachUser, isAdmin, upload.single('image'), createProduct);

productRouter.post('/delete/:id', attachUser, isAdmin, deleteProduct)

productRouter.get('/edit/:id', attachUser, isAdmin, getEditProduct)
productRouter.post('/edit/:id', attachUser, isAdmin, upload.single('image'), postEditProduct)


module.exports = productRouter;