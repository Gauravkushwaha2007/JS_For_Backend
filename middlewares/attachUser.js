const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const attachUser = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            res.locals.user = null;
            req.user = null;
            return next();
        }
        
        // verify token
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = await userModel.findOne({ email: decoded.email }).select('-password');
        
        if (user) {
            req.user = user;
            res.locals.user = user;
        } else {
            res.locals.user = null;
            req.user = null;
        }

        next();

    } catch (err) {
        console.log("Error in attachUser middleware :", err.message);
        res.locals.user = null;
        req.user = null;
        next();
    }
};

module.exports = attachUser;