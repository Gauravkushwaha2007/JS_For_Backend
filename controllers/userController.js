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


//Add-to-cart
const addToCart = async (req, res)=>{
    try{
        let user =  await userModel.findOne({email: req.user.email});
        if(!user) {
            return res.send('Some wrong');
        }
        let product = await productModel.findById(req.params.productId);
        if(!product) {
            return res.send('Product Not Found');
        }

        if(user.cart.includes(product._id)){
            return res.redirect('/users/cart/products')
        }else{
            user.cart.push(product._id);
        }

        await user.save()
        res.redirect('/users/cart/products')
    }
    catch(eror){
        console.error(error.message)
    }
    
}
    
//Remove-to-cart
const removeToCart = async (req, res)=>{
    try{
        const user = await userModel.findOne({email: req.user.email});
        if(!user){
            return res.redirect('/users/cart/products');
        }
        user.cart.pull(req.params.productId);
        await user.save();
        res.redirect('/users/cart/products')
    }
    catch(error){
        console.error(error.message);
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