const express = require("express");
const { default: PG } = require("pg");
const app = express();
const db = require("./db/connection.js");
const endpointsJson = require("./endpoints.json");
const apiControllers = require("./controllers/api.controllers.js")
const articlesControllers = require("./controllers/articles.controllers.js")
const commentsControllers = require("./controllers/comments.controllers.js")
const topicsControllers = require("./controllers/topics.controllers.js")
const usersControllers = require("./controllers/users.controllers.js")

//GET /api
// responds with a list of available endpoints
app.get("/api", apiControllers.getEndpoints);

//GET /api/topics
//* responds with a list of topics
app.get("/api/topics", topicsControllers.getTopics)

//GET /api/articles/:article_id
//* responds with a single article by article_id
app.get("/api/articles/:article_id",articlesControllers.getArticleById)

//GET /api/articles
//* responds with a list of articles
app.get("/api/articles",articlesControllers.getAllArticles)

//GET /api/articles/:article_id/comments
//* responds with a list of comments by article_id
app.get("/api/articles/:article_id/comments",articlesControllers.getAllCommentsByArticleId)

//POST /api/articles/:article_id/comments
//* add a comment by article_id
app.post("/api/articles/:article_id/comments",articlesControllers.addCommentByArticleId)

//PATCH /api/articles/:article_id
//* updates an article by article_id
app.patch("/api/articles/:article_id",articlesControllers.updateArticle)

//GET /api/articles (queries)
//* allows articles to be filtered and sorted
app.get("/api/articles/:query",articlesControllers.getFilteredArticles)

//GET /api/articles/:article_id (comment count)
//* adds a comment count to the response when retrieving a single article
app.get("/api/articles/:article_id",articlesControllers.addCommentToArticle)

//DELETE /api/comments/:comment_id
//* deletes a comment by comment_id
app.delete("/api/comments/:comment_id",commentsControllers.deleteComment)
//GET /api/users
//* responds with a list of users
app.get("/api/users", usersControllers.getUsers)

app.use((req,res) => {
    res.status(404);
    res.send({msg:"Resource Not Found"});
})

module.exports = app;
