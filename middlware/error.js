const ErrorHandler = require('../utils/ErrorHandler');

const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.message = err.message;    // for direct ErrorHanler Object Use

    if (err.code === 11000) {
        error = new ErrorHandler(`Duplicate Resource Entry.`, 400);
    }
    if (err.name === 'ValidationError') {
        msg = Object.values(err.errors).map(val => val.message);
        error = new ErrorHandler(`${msg}`, 400);
    }
    if (err.name === 'CastError') {
        error = new ErrorHandler(`Invalid Resource ID`, 400);
    }
    res.status(error.status || 500).json({ success: false, message: error.message })
}

module.exports = errorHandler;