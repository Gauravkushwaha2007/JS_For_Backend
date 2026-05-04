const express = require('express')
const productModel = require('../models/productModel');
const upload = require('../config/multer');

const createProduct = async (req, res) => {
    try {
        let { name, price, bgColor, textColor, panelColor, discount } = req.body;
        let imagePath = req.file? req.file.filename: null;

        await productModel.create({
            name,
            price,
            bgColor,
            textColor,
            panelColor,
            discount,
            image: imagePath
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send("Couldn't create product");
    }
}

const deleteProduct = async (req, res)=>{
    try{
        let product = await productModel.findByIdAndDelete(req.params.id);
        res.redirect('/products/allProducts')
    }
    catch(error){
        console.error(error.message);
        res.send('Delete failed')
    }
}


module.exports = { createProduct, deleteProduct };