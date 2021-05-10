const UsersModel = require('../models/users');

class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.post('/users/login', this.handleLogin);
        this.app.post('/users/logout', this.handleLogout);
        this.app.post('/users/signup', this.handleSignup);
        this.app.post('/users/reset-password', this.handleResetPassword);
    }

    handleLogin(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (username == 'ntl' && password == 'ntl') {
            res.status(200).json({message: 'OK'});
        } else {
            res.status(401).json({message: 'Failed'});
        }
        
    }
    
    handleLogout(req, res) {}
    
    async handleSignup(req, res) {
        var {status, error} = await UsersModel.checkValidSignup(req.body);
        if (status == 0) {
            res.status(406).json({'message': error});
            return;
        }
        
        var {status, error} = await UsersModel.create(req.body);
        if (status == 0) {
            res.status(403).json({'message': error});
            return;
        }
        res.status(201).json({'message': 'ok'});
    }
    
    handleResetPassword(req, res) {}
}

module.exports = new Route();