const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

const {createProduct, deleteProduct, getEditProduct, postEditProduct, viewProduct} = require('../controllers/productController');
const upload = require('../config/multer');

const productRouter = express.Router();

const multer = require('multer');
const uploadMultipleImages = (req, res, next) => {
    upload.array('images', 5)(req, res, function (err) {
        if (err) {
            let errorMsg = err.message;
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMsg = 'You can upload a maximum of 5 images only!';
                } else if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMsg = 'Each image size must not exceed 5MB!';
                }
            }
            return res.status(400).render('error', {
                status: 400,
                message: "Upload Failed",
                detail: errorMsg,
                buttonText: "Go Back",
                buttonLink: req.originalUrl.includes('edit') ? `/products/edit/${req.params.id}` : "/products/create"
            });
        }
        next();
    });
};

productRouter.get('/allProducts', async(req, res)=>{
    try {
        let products = await productModel.find();
        
        let user = res.locals.user || req.user || null;
        let totalCartPrice = 0;

        if (user) {
            const populatedUser = await userModel.findById(user._id).populate('cart.product');
            
            if (populatedUser && populatedUser.cart) {
                user.cart = populatedUser.cart.filter(item => item.product !== null);
                
                user.cart.forEach(item => {
                    if (item.product && item.product.price) {
                        totalCartPrice += (Number(item.product.price) * Number(item.quantity || 1));
                    }
                });
            }
        }

        res.render('allProducts', {
            products: products,
            user: user,
            totalCartPrice: totalCartPrice 
        });

    } catch (error) {
        console.error("Error in /allProducts route:", error.message);
        res.status(500).render('error', {
            status: 500,
            message: "Internal Server Error",
            detail: "We encountered an unexpected error while fetching the products. Please try again later.",
            buttonText: "Go Back Home",
            buttonLink: "/"
        });
    }
});


productRouter.get('/view/:id', viewProduct);

productRouter.get('/create', isLoggedIn, isAdmin, (req, res)=>{
    res.render('admin/createProduct',{ product: null, activePage: 'createProduct'});
});

productRouter.post('/create', isLoggedIn, isAdmin, uploadMultipleImages, createProduct);

productRouter.post('/delete/:id', isLoggedIn, isAdmin, deleteProduct);

productRouter.get('/edit/:id', isLoggedIn, isAdmin, getEditProduct);

productRouter.post('/edit/:id', isLoggedIn, isAdmin, uploadMultipleImages, postEditProduct);

module.exports = productRouter;
