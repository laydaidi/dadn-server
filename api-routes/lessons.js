const LessonModel = require('../models/lessons');

class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.get('/lessons/list', this.handleList);
        this.app.get('/lessons/view/:lessionId', this.handleView);
    }

    async handleList(req, res) {
        // const {
        //     userName: userName
        // } = req.user;

        var {status, lessons} = await LessonModel.getLessonList();
        if (status == 0) {
            res.status(403).json({message: lessons});
            return;
        }
        res.status(200).json({lessons: lessons});
    }

    handleView(req, res) {}
}

module.exports = new Route();