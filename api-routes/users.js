const UsersModel = require('../models/users');
const Helpers = require('../helpers/helper');

class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.post('/users/login', this.handleLogin);
        this.app.post('/users/logout', this.handleLogout);
        this.app.post('/users/signup', this.handleSignup);
        this.app.post('/users/token', this.handleResetToken);
        this.app.post('/users/reset-password', this.handleResetPassword);

        this.app.get('/users/information', Helpers.authenticateJWT, this.handleInformation);
        this.app.post('/users/save-information', Helpers.authenticateJWT, this.handleSaveInformation);
    }

    async handleLogin(req, res) {
        const {
            username: userName, 
            password: password
        } = req.body;

        var {status, error} = await UsersModel.checkValidLogin(userName, password);
        if (status == 0) {
            res.status(401).json({message: error});
            return;
        }
        
        const accessToken = Helpers.generateAccessToken(userName);
        const refreshToken = Helpers.generateRefreshToken(userName);
        var {status, error} = await UsersModel.saveRefreshToken(userName, refreshToken);
        if (status == 0) {
            res.status(401).json({message: error});
            return;
        }
        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
    }
    
    async handleLogout(req, res) {
        const { 
            token: token 
        } = req.body;

        var {status, error} = await UsersModel.removeRefreshToken(token);
        if (status == 0) {
            res.status(401).json({message: error});
            return;
        }
        res.status(200).json({message: 'ok'});
    }

    async handleResetToken(req, res) {
        const { 
            token: token 
        } = req.body;

        if (!token) {
            res.status(401).json({message: 'invalid token'});
            return;
        }

        var {status, error} = await UsersModel.checkExistRefreshToken(token);
        if (status == 0) {
            res.status(403).json({message: error});
            return;
        }

        var {status, message} = await Helpers.verifyResetToken(token);
        if (status == 0) {
            res.status(403).json({message: message});
            return;
        }
        res.status(200).json({token: message});
    }
    
    async handleSignup(req, res) {
        var {
            status: status, 
            error: error
        } = await UsersModel.checkValidSignup(req.body);
        if (status == 0) {
            res.status(406).json({message: error});
            return;
        }
        
        var {
            status: status, 
            error: error
        } = await UsersModel.create(req.body);

        if (status == 0) {
            res.status(403).json({message: error});
            return;
        }
        res.status(201).json({message: 'ok'});
    }
    
    async handleResetPassword(req, res) {
        var {status, error} = await UsersModel.resetPassword(req.body);
        if (status == 0) {
            res.status(401).json({message: error});
            return;
        }
        res.status(200).json({message: 'ok'});
    }

    async handleInformation(req, res) {

        const {
            userName: userName
        } = req.user;

        var {status, info} = await UsersModel.getInformation(userName);
        if (status == 0) {
            res.status(403).json({message: info});
            return;
        }
        res.status(200).json({info: info});
    }

    async handleSaveInformation(req, res) {
        const {
            userName: userName
        } = req.user;

        var {status, error} = await UsersModel.saveInformation(userName, req.body);
        if (status == 0) {
            res.status(403).json({message: error});
            return;
        }
        res.status(200).json({message: 'ok'});
    }
}

module.exports = new Route();