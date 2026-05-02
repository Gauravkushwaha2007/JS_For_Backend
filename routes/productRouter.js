const express = require('express');

const productRouter = express.Router();

productRouter.get('/products', (req, res)=>{
    res.send('Product Page');
});


module.exports = productRouter;