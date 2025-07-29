const db = require("../db/connection")
//GET /api/topics
//* responds with a list of topics
const fetchAllTopics = () => {
    return db.query("SELECT * FROM Topics")
    .then(({ rows: topics }) => {
        return topics;
    })
}

module.exports = {fetchAllTopics};