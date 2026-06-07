const productModel = require('../models/productModel');
const userModel = require('../models/userModel'); 
const jwt = require('jsonwebtoken'); 
const upload = require('../config/multer');
const path = require('path');
const fs = require('fs');

const createProduct = async (req, res) => {
    try {
        let { name, price, stock, quantity, category, bgColor, textColor, panelColor, discount, description} = req.body;
        let imagePath = req.file? req.file.filename: null;

        await productModel.create({
            name,
            price,
            stock, 
            quantity,
            category,
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
        let { name, price, stock, quantity, category, bgColor, textColor, panelColor, discount, description} = req.body;
        let product = await productModel.findById(req.params.id);

        let updatedData = {
            name,
            price,
            stock, 
            quantity,
            category,
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

        let user = req.user || null;
        let totalCartPrice = 0;
        let stock = product.stock

        if (!user && req.cookies && req.cookies.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                user = await userModel.findOne({ email: decoded.email });
            } catch(jwtErr) {
                console.log("JWT Verification failed in product detail:", jwtErr.message);
            }
        }

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
        
        res.render('productDetail', { 
            product: product, 
            user: user,
            totalCartPrice: totalCartPrice,
            stock: stock
        });
    }

    catch(error){
        console.log("error from productController", error);
        res.status(500).send("Server Error");
    }
}


module.exports = { createProduct, deleteProduct, postEditProduct, getEditProduct, viewProduct};