const express = require('express');
const {registerUser, loginUser} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', (req, res)=>{
    // res.flash("erorr", "Yo are gaurav")
    res.send('User page');
});

userRouter.get('/register', (req,res)=>{
    res.render('register');
});

userRouter.post('/register', registerUser);

userRouter.get('/login', (req, res)=>{
    res.render('login');
});

userRouter.post('/login', loginUser)


module.exports = userRouter;