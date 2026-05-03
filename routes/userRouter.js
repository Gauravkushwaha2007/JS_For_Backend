const express = require('express');
const {registerUser, loginUser} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', (req, res)=>{
    // res.flash("erorr", "Yo are gaurav")
    res.send('User page');
});

userRouter.get('/register', (req,res)=>{
    res.send('register page');
});

userRouter.post('/register', registerUser);

userRouter.get('/login', (req, res)=>{
    res.send('login page');
});

userRouter.post('/login', loginUser)


module.exports = userRouter;