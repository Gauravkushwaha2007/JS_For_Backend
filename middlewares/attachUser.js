const attachUser = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            res.locals.user = null;
            return next();
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await userModel
            .findOne({ email: decoded.email })
            .select('-password');

        res.locals.user = user || null;
        next();

    } catch (err) {
        res.locals.user = null;
        next();
    }
};

module.exports = attachUser;