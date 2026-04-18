const cookieParser = require('cookie-parser');
const Cookies = require('cookies');
const bcrypt = require('bcrypt');
const express = require('express');

const app = express();
app.use(cookieParser());

app.get('/', ((req, res)=>{

    res.cookie('Gaurav', 'This is like a token')
    res.send("HAA meri jaan modi ji");

}));

app.get('/read', ((req, res)=>{
    console.log(req.cookies);
    res.send("Done Modi ji");
}));


app.get('/hashing', ((req, res)=>{
    bcrypt.genSalt(10, ((error, hash)=>{
        console.log(hash);
        bcrypt.hash('Actual@Password', hash ,(error, hash)=>{
            console.log(hash);
        });
    }));
    res.send("done");

}));


app.listen(3000, (()=>{
    console.log(`Server running at http://localhost:3000`);
}))