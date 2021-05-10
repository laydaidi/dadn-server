const jwt = require('jsonwebtoken');

module.exports = {
    authenticateJWT: (req, res, next) => {
        const authHeader = req.headers.authorization;
    
        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    },

    generateAccessToken: (username) => {
        return jwt.sign({user: username}, process.env.JWT_TOKEN_SECRET, {expiresIn: process.env.JWT_EXPIRES});
    },

    generateRefreshToken: (username) => {
        return jwt.sign({user: username}, process.env.JWT_REFRESH_TOKEN_SECRET);
    },

    verifyResetToken: (token) => {
        return new Promise((resolve, _) => {
            jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    resolve({status: 0, message: 'invalid token'});
                    return;
                }
                const accessToken = module.exports.generateAccessToken(user.username);
                resolve({status: 1, message: accessToken});
            });
        });
    }
}