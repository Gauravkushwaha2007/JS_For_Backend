const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Scatch')
.then(()=>{
    console.log('DB Connected')
})
.catch((e)=>{
    console.log('Issue to connect Db')
})

module.exports = mongoose.connection;
