const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware')
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('home', {
        success: req.flash('success')
    });
});


module.exports = router;