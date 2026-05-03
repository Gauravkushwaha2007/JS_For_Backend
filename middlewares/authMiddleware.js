const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
let jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


isLoggedIn = ((req,res,next)=>{
    try{
        let token = req.cookies.token;
        if(!token) {
            req.flash('Error', "You must be login first");
            res.flash('error', 'Invalid or session expired');
            return res.redirect('/');
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = userModel.findOne({email: decoded.email}).select('-password');
        if(!user) {
            return req.flash('error','User not found');
            res.redirect('/');
        }
        req.user = user ;
        next()
    }
    catch(error){
        res.status(502).send('Some wrong');
    }

})

module.exports = isLoggedIn;