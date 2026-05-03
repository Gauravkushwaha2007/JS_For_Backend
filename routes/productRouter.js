const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter.get('/products', (req, res)=>{
    res.send('All Products');
});

productRouter.get('/product', isLoggedIn, (req, res)=>{
    res.send('A single product');
})


module.exports = productRouter;