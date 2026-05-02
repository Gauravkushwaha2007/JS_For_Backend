const ownerModel = require('../models/ownerModel');
const bcrypt = require('bcrypt');
const generateToken = require('../config/generateToken');

// REGISTER
const ownerRegister = async (req, res)=>{
    try{
        const {name, email, password, inctax} = req.body;

        let alreadyOwner = await ownerModel.findOne({email});
        if(alreadyOwner){
            return res.status(409).send('Owner already exists');
        }

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        let owner = await ownerModel.create({
            name,
            email,
            password: hash,
            inctax
        });

        let token = generateToken(owner);

        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(201).send('Owner created successfully');
    }
    catch(error){
        console.log(error.message);
        return res.status(500).send('Something went wrong');
    }
};


// LOGIN 
const loginOwner = async (req, res)=>{
    try{
        let {email, password} = req.body;

        let owner = await ownerModel.findOne({email});
        if(!owner){
            return res.status(404).send('Owner not found');
        }

        let isMatch = await bcrypt.compare(password, owner.password);
        if(!isMatch){
            return res.status(401).send('Email or password is wrong');
        }

        let token = generateToken(owner);

        res.cookie('token', token,{
            httpOnly: true,
            secure: false
        });

        return res.send('Login success');
    }
    catch(error){
        console.log(error.message);
        return res.status(500).send('Something went wrong');
    }
};

module.exports = { ownerRegister, loginOwner };