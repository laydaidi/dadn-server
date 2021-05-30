const LessonModel = require('../models/lessons');
const url = require('url');


class Route {
    constructor() {}
    init(app) {
        this.app = app;
        this.app.get('/lessons/list', this.handleList);
        this.app.get('/lessons/view/:lessonId', this.handleView);
        this.app.get('/video/:videoName', this.handleDownloadVideo);
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

    async handleView(req, res) {
        const {
            lessonId
        } = req.params;

        var {status, lesson} = await LessonModel.getLesson(lessonId);
        if (status == 0) {
            res.status(403).json({message: lesson});
            return;
        }
        res.status(200).json({lessons: lesson});
    }

    async handleDownloadVideo(req, res) {
        const {
            videoName
        } = req.params;

        const path = __basedir + "/videos/" + videoName;
        console.log(path)

        res.download(path, videoName, (err) => {
            if (err) {
                console.log("Download file error: " + err)
                res.status(500).json({
                    message: "Could not download file: " + err,
                });
            }
        });
    }
}

module.exports = new Route();