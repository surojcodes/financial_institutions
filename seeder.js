const fs = require('fs');
const mongoose = require('mongoose');

const Category = require('./model/Category');
const Bank = require('./model/Bank');

const dotenv = require('dotenv');
const colors = require('colors');

//congigure to use environment vars in config/config.env
dotenv.config({ path: './config/config.env' });

// connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//read json file
const categories = JSON.parse(fs.readFileSync(`${__dirname}/data/categories.json`, 'utf-8'));
const banks = JSON.parse(fs.readFileSync(`${__dirname}/data/banks.json`, 'utf-8'));

// data import function
const importData = async () => {
    try {
        await Category.create(categories);
        await Bank.create(banks);
        console.log('Data Imported !'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// data delete function
const deleteData = async () => {
    try {
        await Category.deleteMany();
        await Bank.deleteMany();
        console.log('Data Deleted !'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}