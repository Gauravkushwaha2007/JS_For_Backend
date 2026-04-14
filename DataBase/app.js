const express = require('express');

const app = express();

app.get('/',((req, res)=>{
    res.send('HAA ME4i J11N');
}))


app.listen(3000,(()=>{
    console.log(`server Running at http://localhost:3000`);
}))