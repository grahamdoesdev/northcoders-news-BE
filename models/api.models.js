const endpointsJson = require("../endpoints.json");

const fetchAllEndpoints = () => {
    return endpointsJson;
}

module.exports = {fetchAllEndpoints};