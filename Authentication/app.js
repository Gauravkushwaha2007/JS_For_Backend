const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./models/userModel');
const postModel = require('./models/post');

const app = express();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
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
                res.redirect('/profile');
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
            let token = jwt.sign({email: user.email, userid: user._id}, 'GauravSecret');
            res.cookie('token', token);
            res.status(200).redirect('/profile');
        }else{
            res.send('User not found');
        }
    })
});



app.get('/profile', isLoggedIn, async (req, res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate('posts');
    res.render('profile',{user});

});


app.post('/post', isLoggedIn, async (req, res)=>{
    let {content} = req.body;
    let user = await userModel.findOne({email: req.user.email});
    let post = await postModel.create({
        content,
        user: user._id
    })
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
});



app.get('/update/:id', isLoggedIn, async (req, res)=>{
    let post = await postModel.findOne({_id: req.params.id});
    res.render('update', {post});
});

app.post('/update/:id', isLoggedIn, async(req, res)=>{
    let post = await postModel.findOneAndUpdate({_id: req.params.id},{content: req.body.content}, {new: true});
    res.redirect('/profile');
});



app.post('/delete/:id', isLoggedIn, async (req, res)=>{
    let post = await postModel.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
})

app.post('/logout', ((req, res)=>{
    res.cookie('token', '');
    res.redirect('/login');
}));


app.get('/like/:id', isLoggedIn, async (req, res)=>{
    let post = await postModel.findOne({_id: req.params.id});
    if(post.like.includes(req.user.userid)){
        //unlike
        post.like.pull(req.user.userid)
    }else{
        //like
        post.like.push(req.user.userid);
    }
    await post.save();
    res.redirect('/profile');
    
});


function isLoggedIn(req, res, next){
    if(req.cookies.token === '') res.redirect('/login');
    else{
        let data = jwt.verify(req.cookies.token, 'GauravSecret');
        req.user = data;
        next()
    }
}


app.listen(3000, () => console.log(`Server running at http://localhost:3000`));