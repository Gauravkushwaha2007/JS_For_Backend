const express = require('express');
const {ownerRegister, loginOwner} = require('../controllers/ownerController');
const ownerRouter = express.Router();

ownerRouter.get('/create', (req, res)=>{
    res.send('Fill Owner Form');
});
ownerRouter.post('/create', ownerRegister);


ownerRouter.get('/login', (req, res)=>{
    res.send('Owner Login Page')
});
ownerRouter.post('/login', loginOwner);


module.exports = ownerRouter;