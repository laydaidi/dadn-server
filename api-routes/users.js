const UsersModel = require('../models/users');
const Middleware = require('../helpers/middleware');

var refreshTokens = [];

class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.post('/users/login', this.handleLogin);
        this.app.post('/users/logout', this.handleLogout);
        this.app.post('/users/signup', this.handleSignup);
        this.app.post('/users/token', this.handleResetToken);
        this.app.post('/users/reset-password', this.handleResetPassword);

        this.app.get('/users/information', Middleware.authenticateJWT, this.handleInformation);
    }

    async handleLogin(req, res) {
        const {username, password} = req.body;
        var {status, error} = await UsersModel.checkValidLogin(username, password);
        if (status == 0) {
            res.status(401).json({message: error});
            return;
        }
        
        const accessToken = Middleware.generateAccessToken(username);
        const refreshToken = Middleware.generateRefreshToken(username);
        refreshTokens.push(refreshToken);
        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
    }
    
    handleLogout(req, res) {
        const { token } = req.body;
        refreshTokens = refreshTokens.filter(t => t !== token);
        res.status(200).json({message: 'ok'});
    }

    async handleResetToken(req, res) {
        const { token } = req.body;

        if (!token) {
            res.status(401).json({message: 'invalid token'});
            return;
        }

        if (!refreshTokens.includes(token)) {
            res.status(403).json({message: 'invalid token'});
            return;
        }

        const {status, message} = await Middleware.verifyResetToken(token);
        if (status == 0) {
            res.status(403).json({message: message});
            return;
        }
        res.status(200).json({token: message});
    }
    
    async handleSignup(req, res) {
        var {status, error} = await UsersModel.checkValidSignup(req.body);
        if (status == 0) {
            res.status(406).json({message: error});
            return;
        }
        
        var {status, error} = await UsersModel.create(req.body);
        if (status == 0) {
            res.status(403).json({message: error});
            return;
        }
        res.status(201).json({message: 'ok'});
    }
    
    handleResetPassword(req, res) {}

    async handleInformation(req, res) {

        const {user: username} = req.user;

        var {status, info} = await UsersModel.getInformation(username);
        if (status == 0) {
            res.status(403).json({message: info});
            return;
        }
        res.status(200).json({info: info});
    }
}

module.exports = new Route();