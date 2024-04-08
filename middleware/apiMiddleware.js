const jwt = require('jsonwebtoken');

exports.apiMiddleware = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ")[1] !== process.env.API_KEY)
        return res.status(401).json({
            error: "Unauthorized"
        });
    next();
}