require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo'); 

const db = require('./config/dbConnection');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const router = require('./routes/index');
const adminRouter = require('./routes/adminRouter');
const attachUser = require('./middlewares/attachUser');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI ? `${process.env.MONGODB_URI}/Scatch` : 'mongodb://127.0.0.1:27017/Scatch',
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14 // Valid cookie for 14 days
    }
}));

app.use(flash());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(attachUser);
app.set('view engine', 'ejs');

app.use('/', router);
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/products', productRouter);

app.listen(3000,()=>{
    console.log(`Server Running at http://localhost:3000`);
});