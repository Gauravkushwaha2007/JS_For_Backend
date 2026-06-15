const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const productModel = require('../models/productModel');

router.get('/', async(req, res)=>{
    try{
        let query = {};
        if(req.query.category){
            query.category = req.query.category;
        }

        if(req.query.search){
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        let products = await productModel.find(query);
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
        console.log('Error in home route', error.message, error);
        res.status(500).render('error', {
            status: 500,
            message: "Internal Server Error",
            detail: "We encountered an unexpected error while loading the store homepage. Please try again later.",
            buttonText: "Retry",
            buttonLink: "/"
        });
    }
});

// 📡 लाइव सर्च एंडपॉइंट (यह फ्रंटएंड की रिक्वेस्ट को हैंडल करेगा)
router.get('/products/search', async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query || query.trim() === "") {
      return res.json({ success: true, products: [] });
    }
    const products = await productModel.find({
      name: { $regex: query.trim(), $options: 'i' }
    }).limit(6);
    
    return res.json({ success: true, products: products });
    
  } catch (err) {
    console.error("Backend Search Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/about', (req, res)=>{
    res.render('about');
});

module.exports = router;
