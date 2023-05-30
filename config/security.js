// limit requests per hour
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message:
        "Too many requests created from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
    limiter,
};
