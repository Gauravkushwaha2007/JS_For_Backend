const userModel = require('../models/userModel');

const attachUser = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            res.locals.user = null;
            req.user = null;
            return next();
        }
        
        let user = await userModel.findById(req.session.userId).select('-password');
        
        if (user) {
            req.user = user;
            res.locals.user = user;
        } else {
            delete req.session.userId;
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
