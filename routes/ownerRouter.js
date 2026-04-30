const express = require('express');

const ownerRouter = express.Router()

ownerRouter.get('/', (req, res)=>{
    res.send('Ye hai owner page');
});

module.exports = ownerRouter;