const jwt = require('jsonwebtoken');

exports.adminMiddleware = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ")[1] !== process.env.ADMIN_KEY)
        return res.status(401).json({
            error: "Unauthorized"
        });
    next();
}