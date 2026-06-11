const jwt = require('jsonwebtoken');

const generateToken = (user) =>{
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            _id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
}

module.exports = generateToken;
