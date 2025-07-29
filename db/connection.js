const { Pool } = require("pg");
const db = new Pool();
const ENV = process.env.NODE_ENV || 'production'
if (ENV === "production") {
    db.connectionString = process.env.DATABASE_URL;
    db.max = 2;
}
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

const myPath = '/Users/garethwilliamson/Northcoders/northcoders-news-BE/.env.' + ENV;

require('dotenv').config({path: myPath})
//console.log("DB is " + process.ENV.PGDATABASE);

const config = {};





if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}


module.exports = db;