const apiModels = require("../models/users.models.js");

//GET /api/users
//* responds with a list of users
const getUsers = (req,res) => {
    res.status(200); 
    apiModels.fetchAllUsers()
        .then((users) => {
            res.send({users});
        });
}

module.exports = {getUsers}