class Routes {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.get('/', this.index);
    }

    index(req, res) {
        res.send("??");
    }
}

module.exports = new Routes();