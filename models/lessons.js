const dbConnection = require('./mysql');

class Model {
    async getLessonList() {
        return new Promise((resolve, _) => {
            const sql = "SELECT name, type, description, url FROM Tutorial";
            dbConnection.query(sql, function(err, result) {
                const lessons = JSON.parse(JSON.stringify(result))
                // console.log(lessons)
                if (err) resolve({status: 0, lessons: err.sqlMessage});
                else resolve({status: 1, lessons: lessons});
            });
        });
    }
}

module.exports = new Model();