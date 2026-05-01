const express = require('express');
const app = express();

//Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Ejs setup
app.set('view engine', 'ejs');


app.get('/', ((req, res)=>{
    res.render('index.ejs');
}))

const PORT = 3000;
app.listen(PORT,(()=>{
    console.log(`Server running at http://localhost:${PORT}`);
}))