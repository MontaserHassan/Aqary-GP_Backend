/* eslint-disable eol-last */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
function errorHandler(err, req, res, next) {
    console.log(err);
    const statusCode = err.status || 500;
    const responseBody = {
        error: {
            message: err.message || 'Internal Server Error',
        },
    };
    res.status(statusCode).json(responseBody);
}

module.exports = {
    errorHandler,
};