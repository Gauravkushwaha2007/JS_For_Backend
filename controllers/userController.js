
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');


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
        res.send('Login success');
    }
    catch(error){
        return res.send('Some wrong');
        console.log(error.message);
    }
}
    

module.exports = {registerUser, loginUser}