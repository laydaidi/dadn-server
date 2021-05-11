const validator = require('validator');
const crypto = require('crypto');
const dbConnection = require('./mysql');

class Model {

    async checkValidLogin(userName, password) {
        if (userName === undefined || 
            password === undefined
        ) {
            return {status: 0, error: 'Invalid request'};
        }
        password = crypto.createHash('sha256').update(password).digest('hex');
        return new Promise((resolve, _) => {
            const sql = "SELECT COUNT(*) FROM User WHERE name = ? AND password = ?";
            dbConnection.query(sql, [userName, password], function(err, result, _) {
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
        const {
            username: userName, 
            email: email, 
            phone: phone, 
            pass: pass, 
            repass: repass
        } = requestBody;
        
        if (userName === undefined || 
            email === undefined ||
            phone === undefined ||
            pass === undefined ||
            repass === undefined
        ) {
            return {status: 0, error: 'Invalid request'};
        }
        if (!validator.isAlphanumeric(userName)) {
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
            dbConnection.query(sql, [userName, email, phone], function(err, result, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else {
                    const userCount = result[0]["COUNT(*)"];
                    if (userCount > 0) resolve({status: 0, error: "This account has been existed"});
                    else resolve({status: 1, error: null});
                }
            });
        });
    }

    async checkValidInfo(userName, body) {
        const {
            email: email, 
            phone: phone
        } = body;
        
        if (userName === undefined || 
            email === undefined ||
            phone === undefined
        ) {
            return {status: 0, error: 'Invalid request'};
        }
        if (!validator.isAlphanumeric(userName)) {
            return {status: 0, error: 'Username is not valid (only a-zA-Z0-9)'};
        }
        if (!validator.isEmail(email)) {
            return {status: 0, error: 'Email is not valid'};
        }
        if (!validator.isMobilePhone(phone, ['vi-VN'])) {
            return {status: 0, error: 'Phone is not valid'};
        }

        return new Promise((resolve, _) => {
            const sql = "SELECT COUNT(*) FROM User WHERE name = ? OR email = ? OR phone = ?";
            dbConnection.query(sql, [userName, email, phone], function(err, result, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else {
                    const userCount = result[0]["COUNT(*)"];
                    if (userCount > 1) resolve({status: 0, error: "Can't update to other account"});
                    else resolve({status: 1, error: null});
                }
            });
        });
    }

    async create(requestBody) {
        var {
            username: userName, 
            email: email, 
            phone: phone, 
            pass: pass
        } = requestBody;

        if (userName === undefined || 
            email === undefined ||
            phone === undefined ||
            pass === undefined
        ) {
            return {status: 0, error: 'Invalid request'};
        }
        
        pass = crypto.createHash('sha256').update(pass).digest('hex');
        return new Promise((resolve, _) => {
            const sql = "INSERT INTO User (name, email, phone, password) VALUES (?)";
            dbConnection.query(sql, [[userName, email, phone, pass]], function(err, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else resolve({status: 1, error: null});
            });
        });
    }

    async getInformation(userName) {
        return new Promise((resolve, _) => {
            const sql = "SELECT name, email, phone, gender, birthday, address FROM User WHERE name = ?";
            dbConnection.query(sql, [userName], function(err, result) {
                if (err) resolve({status: 0, info: err.sqlMessage});
                else resolve({status: 1, info: result[0]});
            });
        });
    }

    async saveInformation(userName, data) {

        var {
            status: status,
            error: error
        } = await this.checkValidInfo(userName, data);
        if (status == 0) {
            return {status: 0, error: error}
        }

        const {
            email: email,
            phone: phone,
            birthday: birthday,
            address: address
        } = data;

        return new Promise((resolve, _) => {
            const sql = "UPDATE User SET email = ?, phone = ?, birthday = ?, address = ? WHERE name = ?";
            dbConnection.query(sql, [email, phone, birthday, address, userName], function(err, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else resolve({status: 1, error: null});
            });
        });
    }

    async resetPassword(data) {
        const {
            username: userName,
            email: email,
            phone: phone,
        } = data;

        const password = crypto.createHash('sha256').update("123456").digest('hex');

        return new Promise((resolve, _) => {
            const sql = "UPDATE User SET password = ? WHERE name = ? AND email = ? AND phone = ?";
            dbConnection.query(sql, [password, userName, email, phone], function(err, result) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else {
                    if (result.affectedRows == 0) {
                        resolve({status: 0, error: "Your information is not valid"});
                    } else {
                        resolve({status: 1, error: null});
                    }
                }
            });
        });
    }

    async saveRefreshToken(userName, refreshToken) {
        return new Promise((resolve, _) => {
            const sql = "INSERT INTO UserRefreshToken (userName, token) VALUES (?)";
            dbConnection.query(sql, [[userName, refreshToken]], function(err, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else resolve({status: 1, error: null});
            });
        }); 
    }

    async removeRefreshToken(refreshToken) {
        return new Promise((resolve, _) => {
            const sql = "DELETE FROM UserRefreshToken WHERE token = ?";
            dbConnection.query(sql, [refreshToken], function(err, _) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else resolve({status: 1, error: null});
            });
        }); 
    }

    async checkExistRefreshToken(refreshToken) {
        return new Promise((resolve, _) => {
            const sql = "SELECT COUNT(*) FROM UserRefreshToken WHERE token = ?";
            dbConnection.query(sql, [refreshToken], function(err, result) {
                if (err) resolve({status: 0, error: err.sqlMessage});
                else {
                    const counter = result[0]["COUNT(*)"];
                    if (counter > 0) resolve({status: 1, error: null});
                    else resolve({status: 0, error: "invalid token"});
                }
            });
        }); 
    }
}

module.exports = new Model();