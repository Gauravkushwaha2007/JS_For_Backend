const userModel = require('../models/userModel');

const wantsJsonResponse = (req) => {
    return req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json');
};

const handleUnauthenticated = (req, res, message = 'Please login to continue') => {
    if (wantsJsonResponse(req)) {
        return res.status(401).json({
            success: false,
            loginRequired: true,
            message
        });
    }

    req.flash('error', message);
    return res.redirect('/users/login');
};

const isLoggedIn = (async (req,res,next)=>{
    try{
        if(!req.session || !req.session.userId) {
            return handleUnauthenticated(req, res);
        }

        const user = await userModel.findById(req.session.userId).select('-password');
        if(!user) {
            delete req.session.userId;
            return handleUnauthenticated(req, res, 'User not found');
        }
        req.user = user;
        res.locals.user = user;
        next();
    }
    catch(error){
        console.error('Auth middleware error:', error.message);
        return handleUnauthenticated(req, res);
    }

})

module.exports = isLoggedIn;
