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
app.use(cookieParser())


app.get('/',((req, res)=>{
    res.render('index');
}));

app.post('/register', async (req, res)=>{
    let {name, email, password, age} = req.body;
    let user = await userModel.findOne({email});

    if(user){
        res.status(500).send('User Already Registered')
    }
    else{
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, async(err, hash)=>{
                let user = await userModel.create({
                    name,
                    email,
                    password : hash,
                    age
                });
    
                let token = jwt.sign({email: email, userid: user._id}, 'GauravSecret');
                res.cookie('token', token);
                res.send('Registered Successfully');
            })
        })
    }
});




app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', async (req, res)=>{
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.send('User not found');
    bcrypt.compare(password, user.password, (err, result)=>{
        if(err){
            console.log(err);
            res.send('Something went wrong');
        }
        if(result){
            let token = jwt.sign({email: user.email}, 'GauravSecret');
            res.cookie('token', token);
            res.status(200).send(`Welcome ${user.name}`);
        }else{
            res.send('User not found');
        }
    })
});



app.get('/profile', isLoggedIn, ((req, res)=>{
    console.log(req.user);
    res.redirect('/login');
}));



app.post('/logout', ((req, res)=>{
    res.cookie('token', '');
    res.redirect('/login');
}));

function isLoggedIn(req, res, next){
    if(req.cookies.token === '') res.send('You must be login first');
    else{
        let data = jwt.verify(req.cookies.token, 'GauravSecret');
        req.user = data;
        next()
    }
}


app.listen(3000, () => console.log(`Server running at http://localhost:3000`));