const app =  require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database.js');
dotenv.config({path:path.join(__dirname,'config/config.env')})
connectDatabase();
app.listen(process.env.PORT,()=>{
    console.log(`App is listening to port : ${process.env.PORT} in ${process.env.NODE_ENV}`)
})