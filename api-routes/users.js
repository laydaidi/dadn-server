const Model = require('../models/users');

class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.post('/users/login', this.handleLogin);
        this.app.post('/users/logout', this.handleLogout);
        this.app.post('/users/signup', this.handleSignup);
        this.app.post('/users/reset-password', this.handleResetPassword);
    }

    handleLogin(req, res) {}
    handleLogout(req, res) {}
    handleSignup(req, res) {}
    handleResetPassword(req, res) {}
}

module.exports = new Route();