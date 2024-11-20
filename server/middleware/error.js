const ErrorHandler = require('../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Mongoose Duplicate Key Error 
    if (err.code == 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

module.exports = errorHandler;