const productModel = require('../models/productModel');
const upload = require('../config/multer');
const path = require('path')
const fs = require('fs')

const createProduct = async (req, res) => {
    try {
        let { name, price, stock, quantity, bgColor, textColor, panelColor, discount, description} = req.body;
        let imagePath = req.file? req.file.filename: null;

        await productModel.create({
            name,
            price,
            stock, 
            quantity,
            bgColor,
            textColor,
            panelColor,
            discount,
            description,
            image: imagePath,
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error('error from productController (createProduct)' , error);
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
        let { name, price, stock, quantity, bgColor, textColor, panelColor, discount, description} = req.body;
        let product = await productModel.findById(req.params.id);

        let updatedData = {
            name,
            price,
            stock, 
            quantity,
            discount,
            bgColor,
            panelColor,
            textColor,
            description
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


const viewProduct = async (req, res)=>{

    try{
        let product = await productModel.findById(req.params.id);
    
        if(!product){
            return res.status(404).send("Product not found")
        }
        res.render('productDetail', { product: product, user: req.user || null })
    }

    catch(error){
        console.log("error from productController", error);
        res.status(500).send("Server Error");
    }
}

module.exports = { createProduct, deleteProduct, postEditProduct, getEditProduct, viewProduct};