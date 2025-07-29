const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require('../db/seeds/seed');
const request = require('supertest');
const app = require('../app');
const data = require('../db/data/test-data/index');

beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  db.end();
})

describe("Generic Error handling",() => {
  test("404 - Ensure 404 is returned when a resource cannot be found", () => {
    return request(app)
    .get("/endpointunavailable")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Resource Not Found');
    })
  })
})
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("Testing Topics API", () => {
//GET /api/topics
//* responds with a list of topics
  describe("/api/topics", () => {
    test("Responds with a correct http 200 status",() => {
      return request(app)
      .get("/api/topics")
      .expect(200)
    })
    test("Responds with a list of topics",() => {
      return request(app)
      .get("/api/topics")
      .then(({ body: { topics } }) => {
        expect(topics.length > 0).toBe(true);
        expect(topics[0].description).toBe("The man, the Mitch, the legend");
        expect(topics[1].description).toBe("Not dogs");
      });
    })
  })
})

describe("Testing Articles API", () => {
  describe("Get articles by id",() => {
  //GET /api/articles/:article_id
  //* responds with a single article by article_id
  test("/api/articles/:article_id - responds with a single article by article_id",() => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
  })
  test("- Ensure correct article is returned and correct data",() => {
    return request(app)
    .get("/api/articles/1")
    .then(({body}) => {
      const {article} = body;
      expect(article.author).toBe("butter_bridge");
      expect(article.title).toBe("Living in the shadow of a great man");
      expect(article.article_id).toBe(1);
      expect(article.body).toBe("I find this existence challenging");
      expect(article.topic).toBe("mitch");
      const date = new Date(article.created_at);
      const convertedDate = date.toISOString().slice(0, 10);
      expect(convertedDate).toBe("2020-07-09");
      expect(article.votes).toBe(100);
      expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");  
    })
})
})

describe("Get all articles",() => {
//GET /api/articles
//responds with a list of articles
test.only("/api/articles - responds with a list of articles",() => {
  return request(app)
  .get("/api/articles")
  .expect(200)
})
test.only("Check correct data is return and correctly sorted by date in ascending order",() => {
  return request(app)
  .get("/api/articles")
  .then(({body}) => {
    expect(body.length).toBe(13);
    expect(body[0].title).toBe("Eight pug gifs that remind me of mitch");
    expect(body[12].title).toBe("Z");
  }) 
})
})

describe("GET /api/articles/:article_id/comments",() => {
//GET /api/articles/:article_id/comments
//* responds with a list of comments by article_id
test("/api/articles/:article_id/comments - responds with a list of comments by article_id",() => {
  return request(app)
  .get("/api/articles/1/comments")
  .expect(200)
})
test("Gets a list of comments for an article",() => {
  return request(app)
  .get("/api/articles/1/comments")
  .then(({body}) => {
    expect(body.length).toBe(11);
    expect(body[0].body).toBe("I hate streaming noses");
    expect(body[10].body).toBe("Superficially charming");
  }) 
})
})

describe("POST /api/articles/:article_id/comments",() => {
//POST /api/articles/:article_id/comments
//* add a comment by article_id
test("Post a new comment to an article", () => {
  const content = {username:"icellusedkars",comment:"This is Grahams comment"}
  return request(app)
  .post("/api/articles/1/comments")
  .send(content)
})
})

describe("PATCH /api/articles/:article_id",() => {
//PATCH /api/articles/:article_id
//* updates an article by article_id
test("PATCH /api/articles/:article_id - updates an article by article_id",() => {
  const content = {inc_votes:-44}
  return request(app)
  .patch("/api/articles/1")
  .send(content)
  .expect(200)
  .then((data) => {
    //console.log(data)
  })
})
})

describe("GET /api/articles (queries)",() => {
//GET /api/articles (queries)
//* allows articles to be filtered and sorted
test.only("GET /api/articles (queries) - allows articles to be filtered and sorted",() => {
  const content = {sort_by:"created_date",order:"desc"}
  return request(app)
  .get("/api/articles?sort_by=created_date&order=desc")
  .send(content)
  .expect(200)
})
})

describe("GET /api/articles/:article_id (comment count)", () => {
//GET /api/articles/:article_id (comment count)
//* adds a comment count to the response when retrieving a single article
test("GET /api/articles/:article_id (comment count) - adds a comment count to the response when retrieving a single article",() => {
  return request(app)
  .get("/api/articles/:article_id")
  .expect(200)
})
})
})

describe("Testing Comments API", () => {
//DELETE /api/comments/:comment_id
//* deletes a comment by comment_id
describe("/api/comments/:comment_id", () => {
  test("Responds with a correct http 204 status",() => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  })
  test("Correctly deletes comment from the database", () => {
    return request(app)
      .delete("/api/comments/1")
      .then(() => {
    return db.query("select * from comments where comment_id = 1").then((res) => {
      expect(res.rows.length).toBe(0);
    })
    })
  })
})
})
// GET /api/users
// responds with a list of users
describe("Testing Users API", () => {
    describe("/api/users", () => {
      test("Responds with a correct http 200 status",() => {
        return request(app)
        .get("/api/users")
        .expect(200)
      })
      test("Responds with a list of users",() => {
        return request(app)
        .get("/api/users")
        .then(({ body: { users } }) => {
          expect(users.length > 0).toBe(true);
          expect(users[0].username).toBe("butter_bridge");
          expect(users[1].username).toBe("icellusedkars");
        });
      })
    })
  })
