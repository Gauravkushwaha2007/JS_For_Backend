const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/MongoosePractice`);


const userSchema = mongoose.Schema ({
    Name: String,
    Email: String,
    Mobile: String,
    Age: Number
});

module.exports = mongoose.model("User", userSchema);