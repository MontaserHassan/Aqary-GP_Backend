function errorHandler(err, req, res, next) {
    console.error(err);
    const statusCode = err.status || 500;
    const responseBody = {
        error: {
            message: err.message || 'Internal Server Error',
        },
    };
    res.status(statusCode).json(responseBody);
}

module.exports = {
    errorHandler
};