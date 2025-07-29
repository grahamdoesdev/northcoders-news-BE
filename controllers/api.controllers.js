const apiModels = require("../models/api.models.js");

const getEndpoints = (req,res) => {
    res.status(200); 
    const endpoints = apiModels.fetchAllEndpoints();
    res.send({endpoints});
}

module.exports = {getEndpoints};