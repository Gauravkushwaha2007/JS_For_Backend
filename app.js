const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./config/dbConnection')
const userRouter = require('./routes/userRouter')
const productRouter = require('./routes/productRouter')
const ownerRouter = require('./routes/ownerRouter');

const app = express();


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.set('view engine', 'ejs')


app.use('/', userRouter);
app.use('/products', productRouter);
app.use('/owner', ownerRouter);


app.listen(3000,()=>{
    console.log(`Server Running at http://localhost:3000`);
});