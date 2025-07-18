const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

const myPath = '/Users/garethwilliamson/Northcoders/northcoders-news-BE/.env.' + ENV;

require('dotenv').config({path: myPath})

const db = new Pool();

if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}


module.exports = db;