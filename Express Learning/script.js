const express = require('express');
const app = express();

app.get('/', function(req, res){
    res.send("My Family is Happyi😉😉 yeeeee!!!! yes!");
})

app.get('/isHappy',((req, res)=>{
    res.send("Yes My family is Obeously happy very happy, Every one is Healthy");
}))

const port = 3000;
app.listen(port,()=>{
    console.log(`Listening in http://localhost:${port}`)
});