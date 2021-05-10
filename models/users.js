const jwt = require('jsonwebtoken');
const validator = require('validator');

class Model {

    generateAccessToken(username) {
        return jwt.sign(username, process.env.JWT_TOKEN_SECRET, {expiresIn: '1800s'});
    }

    checkValidSignup(requestBody) {
        const {username, email, phone, pass, repass} = requestBody;
        if (username === undefined || 
            email === undefined ||
            phone === undefined ||
            pass === undefined ||
            repass === undefined
        ) {
            return {status: 0, error: 'Invalid request'};
        }
        if (!validator.isAlphanumeric(username)) {
            return {status: 0, error: 'Username is not valid (only a-zA-Z0-9)'};
        }
        if (!validator.isEmail(email)) {
            return {status: 0, error: 'Email is not valid'};
        }
        if (!validator.isMobilePhone(phone, ['vi-VN'])) {
            return {status: 0, error: 'Phone is not valid'};
        }
        if (pass.length < 6) {
            return {status: 0, error: 'Password length must be greater than 5'};
        }
        if (pass != repass) {
            return {status: 0, error: 'Password and re-typed password must be the same'};
        }
        return {status: 1, error: null}
    }

    create(requestBody) {
        const {username, email, phone, pass, repass} = requestBody;
    }

}

module.exports = new Model();