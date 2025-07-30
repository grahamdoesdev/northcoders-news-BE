const { Pool } = require("pg");

//const ENV = process.env.NODE_ENV || 'production'
const ENV = "production";
process.env.DATABASE_URL = 'postgresql://postgres.ayxajwuvuxgokxkrpcoo:graham999!@aws-0-eu-west-2.pooler.supabase.com:6543/postgres';


if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

const myPath = '/Users/garethwilliamson/Northcoders/northcoders-news-BE/.env.' + ENV;

require('dotenv').config({path: myPath})
//console.log("DB is " + process.ENV.PGDATABASE);

const config = {};

const db = new Pool();

if (ENV === "production") {
    db.connectionString = process.env.DATABASE_URL;
    db.max = 2;
}

if (!process.env.PGDATABASE) {
    //throw new Error("No PGDATABASE configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}


module.exports = db;