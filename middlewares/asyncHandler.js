function asyncFunction(routeFunction) {
    return async function (req, res, next) {
        try {
            await routeFunction(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

module.exports = {
    asyncFunction,
};