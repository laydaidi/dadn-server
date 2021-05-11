const jwt = require('jsonwebtoken');

module.exports = {
    authenticateJWT: (req, res, next) => {
        const authHeader = req.headers.authorization;
    
        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
                if (err) {
                    return res.status(403).json({message: 'Invalid token'});
                }
                req.user = data;
                next();
            });
        } else {
            res.status(401).json({message: 'Invalid header'});
        }
    },

    generateAccessToken: (userName) => {
        return jwt.sign({userName: userName}, process.env.JWT_TOKEN_SECRET, {expiresIn: process.env.JWT_EXPIRES});
    },

    generateRefreshToken: (userName) => {
        return jwt.sign({userName: userName}, process.env.JWT_REFRESH_TOKEN_SECRET);
    },

    verifyResetToken: (token) => {
        return new Promise((resolve, _) => {
            jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, data) => {
                if (err) {
                    resolve({status: 0, message: 'invalid token'});
                    return;
                }
                const {userName: userName} = data;
                const accessToken = module.exports.generateAccessToken(userName);
                resolve({status: 1, message: accessToken});
            });
        });
    }
}