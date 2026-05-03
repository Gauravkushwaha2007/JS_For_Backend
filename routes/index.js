const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware')
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('home', {
        success: req.flash('success')
    });
});

router.get('/shop', isLoggedIn , (req, res)=>{
    res.send('shop');
});

module.exports = router;