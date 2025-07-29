const topicsModels = require("../models/topics.models.js");

//GET /api/topics
//* responds with a list of topics
const getTopics = (req,res) => {
    res.status(200); 
    topicsModels.fetchAllTopics()
        .then((topics) => {
            res.send({topics});
        });
}

module.exports = {getTopics};