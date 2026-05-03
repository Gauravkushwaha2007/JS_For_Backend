const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');


function generateToken(user){
    return jwt.sign(
        {email: user.email, id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
}

module.exports = generateToken;