class Route {
    constructor() {}
    init(app) {
        const routes = [
            require("./users"),
            require("./lessons")
        ];
        for (let r of routes) {
            r.init(app);
        }
        app.use(this.notfound);
    }

    notfound(req, res) {
        res.status(404).json({message: "404 not found"});
    } 
}


module.exports = new Route();