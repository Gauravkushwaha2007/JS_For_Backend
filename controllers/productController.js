const express = require('express')
const productModel = require('../models/productModel');
const upload = require('../config/multer');
const path = require('path')
const fs = require('fs')
const { name } = require('ejs');

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
        let product = await productModel.findById(req.params.id);
        
        if(product.image){
            let imgPath = path.join(__dirname, '../public/uploads', product.image)
            if(fs.existsSync(imgPath)){
                fs.unlinkSync(imgPath)
            }
        }
        await productModel.findByIdAndDelete(req.params.id)

        res.redirect('/products/allProducts')
    }
    catch(error){
        console.error(error.message);
        res.send('Delete failed')
    }
}

const getEditProduct = async (req, res)=>{
    let product = await productModel.findById(req.params.id)
    res.render('createProduct', {product})
}

const postEditProduct = async (req, res)=>{
    try{
        let {name, price, discount, bgColor, panelColor, textColor} = req.body;
        let product = await productModel.findById(req.params.id);

        let updatedData = {
            name,
            price,
            discount,
            bgColor,
            panelColor,
            textColor
        };

        if(req.file){
            if(product.image){
                let imgPath = path.join(__dirname, '../public/uploads', product.image)
                if(fs.existsSync(imgPath)){
                    fs.unlinkSync(imgPath)
                }
            }
            updatedData.image = req.file.filename;
        }

        await productModel.findByIdAndUpdate(req.params.id, updatedData)
        res.redirect('/products/allProducts')
    }
    catch(error){
        console.error(error.message)
    }
}

module.exports = { createProduct, deleteProduct, postEditProduct, getEditProduct};