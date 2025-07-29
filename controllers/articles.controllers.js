const apiModels = require("../models/articles.models.js");

//GET /api/articles/:article_id
//* responds with a single article by article_id
const getArticleById = (req,res) => { 
    const {article_id} = req.params;
    apiModels.getArticleById(article_id)
        .then((article) => {
            res.status(200);
            res.send({article});
        });
}
//GET /api/articles
//* responds with a list of articles
const getAllArticles = (req,res) => {
    //console.log(req.url)
    const urlParams = new URLSearchParams(req.url)
    const qParams = Object.fromEntries(urlParams.entries());
    console.log(qParams);
    apiModels.getAllArticles()
    .then((result) => {
        res.status(200);
        res.send(result);
    })
}

//GET /api/articles/:article_id/comments
//* responds with a list of comments by article_id
const getAllCommentsByArticleId = (req,res) => {
    const {article_id} = req.params;
    apiModels.getAllCommentsByArticleId(article_id)
    .then((result) => {
        res.status(200);
        res.send(result);
    })
}

//POST /api/articles/:article_id/comments
//* add a comment by article_id
const addCommentByArticleId = (req,res) => {
    const {article_id} = req.params;
    let body = '';
    req.on('data', (packet) => {
        body += packet.toString();
    })
    req.on('end', () => {  
    })
    .then(() => {
       return apiModels.addCommentToArticle(article_id,body)   
    })
    .then((result) => {
        res.status(200);
        res.send(result);
    })
}

//PATCH /api/articles/:article_id
//* updates an article by article_id
const updateArticle = (req,res) => {
    const {article_id} = req.params;
    let body = '';
    req.on('data', (packet) => {
        body += packet.toString();
    })
    req.on('end', () => {  
        apiModels.updateArticleById(article_id,body)
        .then((result)=>{
            res.status(200);
            res.send(result);
        })
    })
}

//GET /api/articles (queries)
//* allows articles to be filtered and sorted
const getFilteredArticles = (req,res) => {
    const {filterText} = req.params;
    console.log(req.params);
    res.status(200);
    apiModels.getAllFilteredArticles(filterText)
    .then((result) => {
        res.send();
    })
}

//GET /api/articles/:article_id (comment count)
//* adds a comment count to the response when retrieving a single article
const addCommentToArticle = (req,res) => {
    const {article_id} = req.params;
    res.status(200);
    apiModels.addCommentToArticle(article_id)
    .then((result) => {
        res.send();
    })
}

module.exports = {
    getArticleById,
    getAllArticles,
    getAllCommentsByArticleId,
    addCommentByArticleId,
    updateArticle,
    getFilteredArticles,
    addCommentToArticle}
