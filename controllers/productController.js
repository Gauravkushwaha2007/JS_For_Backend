const fs = require('fs');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const upload = require('../config/multer');
const path = require('path');

const createProduct = async (req, res) => {
    try {
        let { name, price, stock, quantity, category, bgColor, textColor, panelColor, discount, description } = req.body;
        
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => file.filename);
        }
        
        let primaryImage = imagePaths.length > 0 ? imagePaths[0] : 'default-product.png';

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
            image: primaryImage,
            images: imagePaths
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error('Error from productController (createProduct)', error);
        res.status(500).render('error', {
            status: 500,
            message: "Creation Failed",
            detail: "We encountered an unexpected error while creating this product. Please check the inputs and try again.",
            buttonText: "Go Back",
            buttonLink: "/products/create"
        });
    }
};

const deleteProduct = async (req, res)=>{
    try{
        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', {
                status: 404,
                message: "Product Not Found",
                detail: "The product you are trying to delete does not exist.",
                buttonText: "Return to Catalogue",
                buttonLink: "/products/allProducts"
            });
        }
        
        // Delete primary image if it's not the default
        if(product.image && product.image !== 'default-product.png'){
            let imgPath = path.join(__dirname, '../public/uploads', product.image);
            if(fs.existsSync(imgPath)){
                fs.unlinkSync(imgPath);
            }
        }

        // Delete all secondary/array images if they exist
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                if (img !== 'default-product.png' && img !== product.image) {
                    let imgPath = path.join(__dirname, '../public/uploads', img);
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }
            });
        }

        await productModel.findByIdAndDelete(req.params.id);

        res.redirect('/products/allProducts');
    }
    catch(error){
        console.error(error.message);
        res.status(500).render('error', {
            status: 500,
            message: "Deletion Failed",
            detail: "We encountered an unexpected error while deleting the product.",
            buttonText: "Return to Catalogue",
            buttonLink: "/products/allProducts"
        });
    }
};

const getEditProduct = async (req, res)=>{
    try {
        let product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', {
                status: 404,
                message: "Product Not Found",
                detail: "The product you wish to edit does not exist.",
                buttonText: "Return to Catalogue",
                buttonLink: "/products/allProducts"
            });
        }
        res.render('admin/createProduct', {product});
    } catch (error) {
        console.error("getEditProduct error:", error);
        res.status(500).render('error', {
            status: 500,
            message: "Error Retrieving Product",
            detail: "An error occurred while fetching product details for editing.",
            buttonText: "Return to Catalogue",
            buttonLink: "/products/allProducts"
        });
    }
};

const postEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        let { name, price, stock, quantity, category, bgColor, textColor, panelColor, discount, description } = req.body;
        
        const oldProduct = await productModel.findById(productId);
        if (!oldProduct) {
            return res.status(404).render('error', {
                status: 404,
                message: "Product Not Found",
                detail: "The product you are attempting to update does not exist.",
                buttonText: "Return to Catalogue",
                buttonLink: "/products/allProducts"
            });
        }

        let primaryImage = oldProduct.image;
        let imagesArray = oldProduct.images || [];

        // If new files were uploaded, update the images array and primary image
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map(file => file.filename);
            
            // Clean up old images from filesystem
            if (oldProduct.image && oldProduct.image !== 'default-product.png') {
                let oldImgPath = path.join(__dirname, '../public/uploads', oldProduct.image);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            }
            if (oldProduct.images && oldProduct.images.length > 0) {
                oldProduct.images.forEach(img => {
                    if (img !== 'default-product.png' && img !== oldProduct.image) {
                        let oldImgPath = path.join(__dirname, '../public/uploads', img);
                        if (fs.existsSync(oldImgPath)) {
                            fs.unlinkSync(oldImgPath);
                        }
                    }
                });
            }

            primaryImage = newImagePaths[0];
            imagesArray = newImagePaths;
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
            image: primaryImage,
            images: imagesArray
        });

        res.redirect('/products/allProducts');
    } catch (error) {
        console.error('Error from productController (postEditProduct)', error);
        res.status(500).render('error', {
            status: 500,
            message: "Update Failed",
            detail: "We were unable to save the changes made to the product. Please try again.",
            buttonText: "Go Back",
            buttonLink: `/products/edit/${req.params.id}`
        });
    }
};

const viewProduct = async (req, res)=>{
    try{
        let product = await productModel.findById(req.params.id);
    
        if(!product){
            return res.status(404).render('error', {
                status: 404,
                message: "Product Not Found",
                detail: "The product details you are trying to view could not be located.",
                buttonText: "Return to Shopping",
                buttonLink: "/"
            });
        }

        let user = req.user || null;
        let totalCartPrice = 0;
        let stock = product.stock;

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
        
        // Fetch up to 4 related products in the same category (backfill if needed)
        let relatedProducts = await productModel.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        if (relatedProducts.length < 4) {
            const additionalProducts = await productModel.find({
                _id: { $ne: product._id, $nin: relatedProducts.map(p => p._id) }
            }).limit(4 - relatedProducts.length);
            relatedProducts = [...relatedProducts, ...additionalProducts];
        }
        
        res.render('productDetail', { 
            product: product, 
            user: user,
            totalCartPrice: totalCartPrice,
            stock: stock,
            relatedProducts: relatedProducts
        });
    }

    catch(error){
        console.log("error from productController", error);
        res.status(500).render('error', {
            status: 500,
            message: "Internal Server Error",
            detail: "An unexpected server error occurred while retrieving product details.",
            buttonText: "Return to Shopping",
            buttonLink: "/"
        });
    }
};

module.exports = { createProduct, deleteProduct, postEditProduct, getEditProduct, viewProduct};
