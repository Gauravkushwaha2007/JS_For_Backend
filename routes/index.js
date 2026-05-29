const express = require('express');
const router = express.Router();

const attachUser = require('../middlewares/attachUser');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');



router.get('/', attachUser, async(req, res)=>{
    
    try{
        let products = await productModel.find().limit(8);
        let user = res.locals.user || req.user || null;
        
        let totalCartPrice = 0;
    
        if(user){
            const populatedUser = await userModel.findById(user._id).populate('cart.product');

                if (populatedUser && populatedUser.cart){
                user.cart = populatedUser.cart.filter(item => item.product !== null);

                user.cart.forEach(item => {
                    if (item.product && item.product.price) {
                        totalCartPrice += (Number(item.product.price) * Number(item.quantity || 1));
                    }
                });

            }
        }

        res.render('home',{ 
            products: products,
            user: user,
            totalCartPrice : totalCartPrice,
            success: req.flash("Success")
        });
    }
    catch(error){
        console.log('Error in home route', error.message, error)
        res.status(500).send("Server error", error)
    }
});


module.exports = router;