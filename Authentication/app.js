const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userModel = require('./models/userModel');
const bcrypt = require('bcrypt');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))


app.get('/',((req, res)=>{
    res.render('index');
}));

app.post('/create', (req, res)=>{
    let {name, email, password, age} = req.body;

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async(err, hash)=>{
            let createdUser = await userModel.create({
                name,
                email,
                password : hash,
                age
            });

            let token = jwt.sign({email: email}, 'GauravSecret');
            res.cookie('token', token);
            res.send(createdUser);
        });
    });
});


app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', async (req, res)=>{
    let user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send('Something went wrong');
    bcrypt.compare(req.body.password, user.password, (err, result)=>{
        if(err){
            console.log(err);
            res.send('Something went wrong');
        }
        if(result){
            let token = jwt.sign({email: user.email}, 'GauravSecret');
            res.cookie('token', token);
            res.send(`Welcome ${user.name}`);
        }else{
            res.send('User not found');
        }
    });
});


app.post('/logout', ((req, res)=>{
    res.cookie('token', '');
    res.render('index');
}));



app.listen(3000, () => console.log(`Server running at http://localhost:3000`));