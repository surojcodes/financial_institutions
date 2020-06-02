const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
}
module.exports = connectDB;