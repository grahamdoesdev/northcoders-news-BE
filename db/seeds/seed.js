// #region Requires and constants
const db = require("../connection");
const format = require('pg-format');
const topics = require("../data/development-data/topics");
// #endregion

// #region Formatting data functions
function FormatTopicData(topics)
{
  let outArr = [];
  topics.forEach(topic => {
    let inArr = [];
    inArr.push(topic.description);
    inArr.push(topic.slug);
    inArr.push(topic.img_url);
    outArr.push(inArr);
  });
  return outArr;
}

function FormatUserData(users)
{
let outArr = [];
  users.forEach(user => {
    let inArr = [];
    inArr.push(user.username);
    inArr.push(user.name);
    inArr.push(user.avatar_url);
    outArr.push(inArr);
  });
  return outArr;
}

function FormatArticleData(articles)
{
let outArr = [];
  articles.forEach(article => {
    let inArr = [];
    inArr.push(article.title);
    inArr.push(article.topic);
    inArr.push(article.author);
    inArr.push(article.body);
    const _date = new Date(article.created_at)
    inArr.push(_date);
    inArr.push(article.votes);
    inArr.push(article.article_img_url);
    outArr.push(inArr);
  });
  return outArr;
}

function FormatCommentData(comments,articleInsertData)
{
let outArr = [];
  comments.forEach(comment => {
    let article_id = 0;
    articleInsertData.forEach(article => {
      if(article.title == comment.article_title){
        article_id = article.article_id;
      }
    });
    let inArr = [];
    inArr.push(article_id);
    inArr.push(comment.body);
    inArr.push(comment.votes);
    inArr.push(comment.author);
    const _date = new Date(comment.created_at)
    inArr.push(_date);
    outArr.push(inArr);
  });
  return outArr;
}
// #endregion

// #region Classes and data processing functions
class DatabaseTable {
  constructor(tableName) {
    this.tableName = tableName;
    this.tableColumns = [];
  }
}

async function InsertDataIntoDatabase(queryToRun){
  return db.query(queryToRun);
}

async function TeardownAndCreateTable(tablesetup){
  return db.query("DROP TABLE IF EXISTS " + tablesetup.tableName + " CASCADE")
    .then((res) => {
      
      let columnStringCreator = "CREATE TABLE " + tablesetup.tableName + " (";
      tablesetup.tableColumns.forEach(element => {
        columnStringCreator = columnStringCreator + element + ","
      });
      columnStringCreator = columnStringCreator.slice(0, -1);
      columnStringCreator = columnStringCreator + ")";

      return db.query(columnStringCreator);
    })
}
// #endregion

// #region Seed output
const seed = ((topicData, userData, articleData, commentData) => {
// #region Setup tables
  const topicsTable = new DatabaseTable("topics");
  topicsTable.tableColumns.push("slug VARCHAR(500) NOT NULL PRIMARY KEY");
  topicsTable.tableColumns.push("description VARCHAR(1000)");
  topicsTable.tableColumns.push("img_url VARCHAR(1000)");
  topicsTable.dataToInsert = topicData.topicData;

  const userDataTable = new DatabaseTable("users");
  userDataTable.tableColumns.push("username VARCHAR(50) NOT NULL PRIMARY KEY UNIQUE");
  userDataTable.tableColumns.push("name VARCHAR(50)");
  userDataTable.tableColumns.push("avatar_url VARCHAR(1000)");
  userDataTable.dataToInsert = topicData.userData;

  const articleDataTable = new DatabaseTable("articles");
  articleDataTable.tableColumns.push("article_id SERIAL PRIMARY KEY");
  articleDataTable.tableColumns.push("title VARCHAR(1000)");
  articleDataTable.tableColumns.push("topic VARCHAR(1000)");
  articleDataTable.tableColumns.push("author VARCHAR(50)");
  articleDataTable.tableColumns.push("body TEXT");
  articleDataTable.tableColumns.push("created_at timestamp default current_timestamp");
  articleDataTable.tableColumns.push("votes INT DEFAULT 0");
  articleDataTable.tableColumns.push("article_img_url VARCHAR(1000)");
  articleDataTable.tableColumns.push("FOREIGN KEY (topic) REFERENCES topics(slug)");
  articleDataTable.tableColumns.push("FOREIGN KEY (author) REFERENCES users(username)");
  articleDataTable.dataToInsert = topicData.articleData;

  const commentDataTable = new DatabaseTable("comments");
  commentDataTable.tableColumns.push("comment_id SERIAL PRIMARY KEY");
  commentDataTable.tableColumns.push("article_id INT");
  commentDataTable.tableColumns.push("body TEXT");
  commentDataTable.tableColumns.push("author VARCHAR(500)");
  commentDataTable.tableColumns.push("votes INT DEFAULT 0");
  commentDataTable.tableColumns.push("created_at timestamp default current_timestamp");
  commentDataTable.tableColumns.push("FOREIGN KEY (article_id) REFERENCES articles(article_id)");
  commentDataTable.tableColumns.push("FOREIGN KEY (author) REFERENCES users(username)");
// #endregion

// #region Create the tables and insert data
  return TeardownAndCreateTable(topicsTable)
  .then(() => {
    return TeardownAndCreateTable(userDataTable)
  })
  .then(() => {
    return TeardownAndCreateTable(articleDataTable)
  })
  .then(() => {
    return TeardownAndCreateTable(commentDataTable)
  })
  .then(() => {
    const query = format(
      "INSERT INTO topics (description,slug,img_url) VALUES %L",
      FormatTopicData(topicData.topicData));
      return InsertDataIntoDatabase(query);
  })
  .then(() => {
    const query = format(
      "INSERT INTO users (username,name,avatar_url) VALUES %L",
      FormatUserData(topicData.userData));
      return InsertDataIntoDatabase(query);
  })
  .then(() => {
    const query = format(
      "INSERT INTO articles (title,topic,author,body,created_at,votes,article_img_url) VALUES %L",
      FormatArticleData(topicData.articleData));
      return InsertDataIntoDatabase(query);
  })
  .then(() => {
    return db.query("SELECT article_id,title FROM articles")
  })
  .then((returnVal) => {
    const articleInsertTable = returnVal.rows;
    const query = format(
      "INSERT INTO comments (article_id,body,votes,author,created_at) VALUES %L",
      FormatCommentData(topicData.commentData,articleInsertTable));
      return InsertDataIntoDatabase(query);
  })
  // #endregion
})
// #endregion

module.exports = seed;