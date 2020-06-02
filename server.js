const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middlware/error');
const fileupload = require('express-fileupload');
const path = require('path');

// routes
const categories = require('./routes/category');
const banks = require('./routes/bank');

const colors = require('colors');
const connectDB = require('./config/connect');

// create the express app
const app = express();

// congifure to use environment variables in config/config.env
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// For req.body
app.use(express.json());

// for file upload
app.use(fileupload());

//make the logos folder static so that it can be accessed easily 
//logos will be accessible using http://localhost:5000/logoname
app.use(express.static(path.join(__dirname, 'public/logos')))

// Mount Routes
app.use('/api/v1/categories', categories);
app.use('/api/v1/banks', banks);

// error handling custom class
app.use(errorHandler);

// port info and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started in ${process.env.NODE_ENV} mode on PORT ${PORT}`));
