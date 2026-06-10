const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const attachUser = require('../middlewares/attachUser');

const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

const {createProduct, deleteProduct, getEditProduct, postEditProduct, viewProduct} = require('../controllers/productController')
const upload = require('../config/multer');

const productRouter = express.Router();


productRouter.get('/allProducts', attachUser, async(req, res)=>{
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
        res.status(500).send("Server Error");
    }
});


productRouter.get('/view/:id', attachUser, viewProduct);

productRouter.get('/create', attachUser, isAdmin, (req, res)=>{
    res.render('admin/createProduct',{ product: null, activePage: 'createProduct'});
})

productRouter.post('/create', attachUser, isAdmin, upload.single('image'), createProduct);

productRouter.post('/delete/:id', attachUser, isAdmin, deleteProduct)

productRouter.get('/edit/:id', attachUser, isAdmin, getEditProduct)
productRouter.post('/edit/:id', attachUser, isAdmin, upload.single('image'), postEditProduct)



module.exports = productRouter;