const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    products: {
        type: Array,
        defautl: []
    },
    picture: String,
    inctax: String
});

module.exports = mongoose.model('owner', ownerSchema);