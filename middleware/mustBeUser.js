const jwt = require('jsonwebtoken');
const User = require('../schemas/user.schema');

exports.mustBeUser = async (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ")[1] !== "")
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.API_KEY);

            const user = await User.find({ _id: decoded._id })
            .select('-password');

            req.user = user[0];

            if(!user)
                return res.status(401).json({
                    message: 'Unauthorized'
                });


        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
    next();
}