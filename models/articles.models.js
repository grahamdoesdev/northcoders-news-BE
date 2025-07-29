const { json } = require("express");
const db = require("../db/connection")

//GET /api/articles/:article_id
//* responds with a single article by article_id
const getArticleById  = (comment_id) => { 
    return db.query("SELECT * FROM articles WHERE article_id=" + comment_id)
        .then(({rows}) => {
            const article = rows[0];
            return article;
        }
    )  
}

//GET /api/articles
//* responds with a list of articles
const getAllArticles = () => {
    
    return db.query("SELECT * FROM articles ORDER BY created_at DESC")
    .then(({rows}) => {
        const articles = rows;
        return articles;
    }
)  
}

//GET /api/articles/:article_id/comments
//* responds with a list of comments by article_id
const getAllCommentsByArticleId = (article_id) => {
    return db.query("SELECT * FROM comments WHERE article_id=" + article_id + " order by created_at desc")
    .then(({rows}) => {
        const comments = rows;
        return comments;
    }
)  
}

//POST /api/articles/:article_id/comments
//* add a comment by article_id
const addCommentToArticle = (article_id,content) => {
    const data = JSON.parse(content);
    const query = "insert into comments (author,body,article_id) VALUES('" + data.username + "','" + data.comment + "'," + article_id + ") RETURNING comment_id";
    return db.query(query)
        .then((result) => {
        db.query("SELECT * FROM comments where comment_id = " + result.rows[0])
        .then((newResult) => {
            return newResult.rows[0];
        })
    })
}

//PATCH /api/articles/:article_id
//* updates an article by article_id
const updateArticleById = (article_id,content) => {
    const data = JSON.parse(content); 
    const voteCountChange = data.inc_votes;
    const query = "UPDATE articles SET votes = votes + " + voteCountChange + " WHERE article_id = " + article_id + ";"
    return db.query(query)
    .then(() => {
        return db.query("SELECT * FROM articles where article_id = " + article_id)
    })
    .then((newResult) => {
        return newResult.rows[0];
    })
}

//GET /api/articles (queries)
//* allows articles to be filtered and sorted
const getAllFilteredArticles = (filter_query) => {
    return db.query("select * from articles")
        .then((result) => {
            return;
        })
}

//GET /api/articles/:article_id (comment count)
//* adds a comment count to the response when retrieving a single article
const getArticlesWithCommentCount = (article_id) => {
    return db.query("select * from articles")
        .then((result) => {
            return;
        })
}

module.exports = {
    getArticleById,
    getArticlesWithCommentCount,
    getAllFilteredArticles,
    updateArticleById,
    addCommentToArticle,
    getAllCommentsByArticleId,
    getAllArticles
}