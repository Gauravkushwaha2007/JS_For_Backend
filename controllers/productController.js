const fs = require('fs');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const upload = require('../config/multer');
const path = require('path');

const createProduct = async (req, res) => {
    try {
        let { name, price, stock, quantity, category, bgColor, textColor, panelColor, discount, description } = req.body;
        
        let imagePath = req.file ? req.file.filename : 'default-product.png';

        await productModel.create({
            name,
            price: Number(price),
            stock: Number(stock),
            discount: Number(discount) || 0,
            quantity,
            category,
            bgColor: bgColor || '#ffffff',
            textColor: textColor || '#111827',
            panelColor: panelColor || '#f3f4f6',
            description,
            image: imagePath,
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error('Error from productController (createProduct)', error);
        res.status(500).send("Couldn't create product");
    }
};

const deleteProduct = async (req, res)=>{
    try{
        let product = await productModel.findById(req.params.id);
        
        if(product.image && product.image !== 'default-product.png'){
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
    res.render('admin/createProduct', {product})
}

const postEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        let { name, price, stock, quantity, category, bgColor, textColor, panelColor, discount, description } = req.body;
        
        const oldProduct = await productModel.findById(productId);
        if (!oldProduct) return res.status(404).send("Product not found");

        let imagePath = oldProduct.image;
        if (req.file) {
            imagePath = req.file.filename;
            if (oldProduct.image && oldProduct.image !== 'default-product.png') {
                let oldImgPath = path.join(__dirname, '../public/uploads', oldProduct.image);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            }
        }

        await productModel.findByIdAndUpdate(productId, {
            name,
            price: Number(price),
            stock: Number(stock),
            discount: Number(discount) || 0,
            quantity,
            category,
            bgColor,
            textColor,
            panelColor,
            description,
            image: imagePath
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error('Error from productController (postEditProduct)', error);
        res.status(500).send("Couldn't update product");
    }
};

const viewProduct = async (req, res)=>{
    try{
        let product = await productModel.findById(req.params.id);
    
        if(!product){
            return res.status(404).send("Product not found")
        }

        let user = req.user || null;
        let totalCartPrice = 0;
        let stock = product.stock

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
