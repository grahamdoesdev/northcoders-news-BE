const db = require("../db/connection")
//GET /api/users
//* responds with a list of users

const fetchAllUsers = () => {
    return db.query("SELECT * FROM Users")
    .then(({ rows: users }) => {
        return users;
    })
}

module.exports = {fetchAllUsers};