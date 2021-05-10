const validator = require('validator');
const crypto = require('crypto');
const dbConnection = require('./mysql');

class Model {

    async checkValidLogin(username, password) {
        if (username === undefined || 
            password === undefined
        ) {
            return {status: 0, error: 'Invalid request'};
        }
        password = crypto.createHash('sha256').update(password).digest('hex');
        return new Promise((resolve, _) => {
            const sql = "SELECT COUNT(*) FROM User WHERE name = ? AND password = ?";
            dbConnection.query(sql, [username, password], function(err, result, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else {
                    const userCount = result[0]["COUNT(*)"];
                    if (userCount == 0) {
                        resolve({status: 0, error: "This account is not existed in the system"});
                    } else {
                        resolve({status: 1, error: null});
                    }
                    
                }
            });
        });
    }

    async checkValidSignup(requestBody) {
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

        return new Promise((resolve, _) => {
            const sql = "SELECT COUNT(*) FROM User WHERE name = ? OR email = ? OR phone = ?";
            dbConnection.query(sql, [username, email, phone], function(err, result, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else {
                    const userCount = result[0]["COUNT(*)"];
                    if (userCount > 0) {
                        resolve({status: 0, error: "This account has been existed"});
                    } else {
                        resolve({status: 1, error: null});
                    }
                    
                }
            });
        });
    }

    async create(requestBody) {
        var {username, email, phone, pass, _} = requestBody;
        pass = crypto.createHash('sha256').update(pass).digest('hex');
        return new Promise((resolve, _) => {
            const sql = "INSERT INTO User (name, email, phone, password) VALUES (?)";
            dbConnection.query(sql, [[username, email, phone, pass]], function(err, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else resolve({status: 1, error: null});
            });
        });
    }

}

module.exports = new Model();