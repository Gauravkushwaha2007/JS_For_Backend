const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const sendmail = require('../utils/mailer');


//REGISTER
const registerUser = async (req, res)=>{
    try{
        let {name, email, password, contact} = req.body
    
        let registeredUser = await userModel.findOne({email})
        if(registeredUser){
            return res.send('Already registered with this email')
        }
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        let user = await userModel.create({
            name,
            email, 
            password: hash,
            contact
        })
        let token = generateToken(user);
        res.cookie('token', token,{
            httpOnly: true,
            secure: false
        })
        await sendmail(user.email,
            "Welcome Dost",
            `<h2> Hellow ${user.name} </h2>
            <h3> kaise ho dost Ye mera fist trial hai </h3>`
        );
        res.send('User created successfully')
        
    }
    catch(error){
        return res.status(500).send('Something went wrong')
    }
};


//LOGIN
const loginUser = async (req, res)=>{
    try{
        let {email, password} = req.body
        let user = await userModel.findOne({email});
        if(!user) {
            return res.send('User not found')
        }
        let isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.send('Email or password is wrong')
        }else{
            let token = generateToken(user)
            res.cookie('token', token,{
                secure: false,
                httpOnly: true
            })
        }
        res.render('home', {user: user});
    }
    catch(error){
        return res.send('Some wrong');
        console.log(error.message);
    }
}


//Add-to-cart with AJAX
const addToCart = async (req, res)=>{
    try{
        let user =  await userModel.findOne({email: req.user.email});
        let product = await productModel.findById(req.params.productId);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if(user.cart.some((i)=> i.toString() === product._id.toString())){
            return res.json({
                success: false,
                message: "Already in Cart"
            })
        }
        user.cart.push(product._id);
        await user.save()
        res.json({
            success: true,
            message: "Added to Cart"
        })
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Some Wrong"
        })
    }
}
    

//Remove-to-cart with AJAX
const removeToCart = async (req, res)=>{
    try{
        const user = await userModel.findOne({email: req.user.email});
        if(!user){
            res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }
        user.cart.pull(req.params.productId);
        await user.save();
        res.json({
            success: true,
            message: "Removed from cart"
        })
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


// Cart-Products-Page
const cartProducts = async (req, res)=>{
    try{
        let user = await userModel.findOne({email: req.user.email}).populate('cart');
        if(!user){
            return res.redirect('/users/login');
        }
        let products = user.cart;
        res.render('cartProducts', {products: products});

    }
    catch(error){
        console.error(error.message);
    }
}


module.exports = {registerUser, loginUser, addToCart, cartProducts, removeToCart}