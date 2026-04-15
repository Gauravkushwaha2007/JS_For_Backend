const express = require('express');
const UserModel = require('./userModel');
const app = express();

app.get('/',((req, res)=>{
    res.send('H44 M34i J44N');
}));

app.get('/create',async (req, res)=>{
    let OneUser = await UserModel.create({
        Name: 'Gaurav',
        Email: 'Gaurav@gmail.com',
        Mobile: '1223456778',
        Age: 500
    });
    res.send(OneUser);
});

app.get('/read', async (req, res)=>{
    let users = await UserModel.find();
    res.send(users);
});

app.get('/update', async (req, res)=>{
    const updatedUser = await UserModel.findOneAndUpdate(
        {Name: 'Gaurav'},
        {Age: 20},
        {new: true}
    );
    res.send(updatedUser);
});


app.get('/delete', async (req,res)=>{
    const DeletedUser = await UserModel.findOneAndDelete({Name: 'Gaurav'});
    res.send(DeletedUser);
})


app.listen(3000,(()=>{
    console.log(`server Running at http://localhost:3000`);
}))