const cookieParser = require('cookie-parser');
const Cookies = require('cookies');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());

app.get('/', ((req, res)=>{
    let token = jwt.sign({email : 'Email@gamil.com'}, 'secret')
    res.cookie('token', token);
    res.send("Done modi ji");

}));

app.get('/verify', ((req, res)=>{
    let data = jwt.verify(req.cookies.token, 'secret');
    res.send(data);
    console.log(data);
}))

// app.get('/read', ((req, res)=>{
//     console.log(req.cookies);
//     res.send("Done Modi ji");
// }));


// app.get('/hashing', ((req, res)=>{
//     bcrypt.genSalt(10, ((error, hash)=>{
//         console.log(hash);
//         bcrypt.hash('Actual@Password', hash ,(error, hash)=>{
//             console.log(hash);
//         });
//     }));
//     res.send("done");

// }));

// app.get('/check', ((req, res)=>{
//     bcrypt.compare('Actual@Password', '$2b$10$4DiRq.E9CYMso4IuhweE3ek0mvSQM2fdPzHl7YY2rPt2GGWfh4Eky', (err, result)=>{
//         console.log(result);
//     })
// }))


app.listen(3000, (()=>{
    console.log(`Server running at http://localhost:3000`);
}))