const express = require('express');
const cors = require('cors');
const qs = require('qs');
const app = express();
const cookieParser = require('cookie-parser')
const products = require('./routes/product');
const auth = require('./routes/auth')
const order = require('./routes/order');
const error = require('./middwares/error');
const cart = require('./routes/cart');
const wishlist = require('./routes/wishList');
const address = require('./routes/address')
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.set('query parser', str => qs.parse(str));
app.use(express.json());
app.use(cookieParser());
app.use('/api/',products);
app.use('/api/',auth);
app.use('/api/',order);
app.use('/api/',cart);
app.use('/api/',wishlist)
app.use('/api/', address);
app.use(error);
module.exports = app;