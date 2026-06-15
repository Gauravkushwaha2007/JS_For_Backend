
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).redirect('/users/login');
    }

    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).render('error', {
            status: 403,
            message: "Access Denied",
            detail: "Access Denied. Only administrator accounts have permission to perform this action.",
            buttonText: "Return Home",
            buttonLink: "/"
        });
    }
};

module.exports = isAdmin;