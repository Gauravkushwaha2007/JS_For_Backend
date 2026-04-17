const express = require('express');
const path = require('path');
const UserModel = require('./model/userModel');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));


app.get('/',((req, res)=>{
    res.render('index');
}));

app.get('/read', async (req, res)=>{
    const users = await UserModel.find();
    res.render('read',{users});
});

app.post('/create', async (req, res)=>{
    const {name,email,image} = req.body;
    const createdUser = await UserModel.create({
        name,
        email,
        image 
    });
    res.redirect('/read');
});

app.post('/delete/:name', async (req, res)=>{
    const deletedUser = await UserModel.findOneAndDelete({name: `${req.params.name}`});
    console.log(`User deleted ${deletedUser}`);
    res.redirect('/read'); 
});


app.listen(3000,(()=>{
    console.log(`Server running at http://localhost:3000`)
}));