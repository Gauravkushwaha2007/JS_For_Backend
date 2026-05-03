const express = require('express')
const productModel = require('../models/productModel');


const createProduct = async (req, res) => {

    try {
        let { name, price, bgColor, textColor, panelColor, discount } = req.body;

        await productModel.create({
            name,
            price,
            bgColor,
            textColor,
            panelColor,
            discount
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send("Couldn't create product");
    }
}


module.exports = { createProduct };