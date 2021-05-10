const Model = require('../models/lessons');

class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.get('/lessons/list', this.handleList);
        this.app.get('/lessons/view/:lessionId', this.handleView);
    }

    handleList(req, res) {}
    handleView(req, res) {}
}

module.exports = new Route();