const dbConnection = require('./mysql');

class Model {
    async getLessonList(userName) {
        return new Promise((resolve, _) => {
            const sql = "SELECT id, name, type, description, url FROM Tutorial WHERE user_name= ?";
            dbConnection.query(sql, [userName], function(err, result) {
                const lessons = JSON.parse(JSON.stringify(result))
                // console.log(lessons)
                if (err) resolve({status: 0, lessons: err.sqlMessage});
                else resolve({status: 1, lessons: lessons});
            });
        });
    }

    async getLesson(lessonId, userName) {
        return new Promise((resolve, _) => {
            const sql = "SELECT id, name, type, description, url FROM Tutorial WHERE id= ? AND user_name = ?";
            dbConnection.query(sql, [lessonId, userName], function(err, result) {
                if (err) resolve({status: 0, lesson: err.sqlMessage});
                else resolve({status: 1, lesson: result[0]});
            });
        });
    }
}

module.exports = new Model();