const mongoose = require('mongoose');
const dbgr = require('debug')('development:db');
const config = require('config');

mongoose.connect(`${config.get("MONGODB_URI")}/Scatch`)
.then(()=>{
    dbgr('DB Connected')
})
.catch((e)=>{
    dbgr('Issue to connect to DB')
})

module.exports = mongoose.connection;
