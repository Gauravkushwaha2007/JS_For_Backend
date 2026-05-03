const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
let jwt = require('jsonwebtoken');


isLoggedIn = ((req,res,next)=>{
    try{
        let token = req.cookies.token;
        if(!token) {
            req.flash('Error', "You must be login first");
            return res.send('login karo pahle')
        }

        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = data;
        next()
    }
    catch(error){
        res.status(502).send('Some wrong');
    }

})

module.exports = isLoggedIn;