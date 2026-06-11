require('dotenv').config()
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const { MongoStore } = require('connect-mongo');

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
    rolling: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI ? `${process.env.MONGODB_URI}/Scatch` : 'mongodb://127.0.0.1:27017/Scatch',
        ttl: 30 * 24 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));

app.use(flash());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(attachUser);
app.set('view engine', 'ejs');

app.use('/', router);
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/products', productRouter);

app.listen(3000,()=>{
    console.log(`Server Running at http://localhost:3000`);
});
