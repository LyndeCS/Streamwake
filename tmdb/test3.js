require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const TMDB_RAT = process.env.TMDB_RAT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
	maxConcurrent: 1, // Number of concurrent requests
	minTime: 1000, // Minimum time (in milliseconds) between requests
});

const base_url =
	"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=true&sort_by=primary_release_date.asc&with_genres=16&with_keywords=210024";
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${TMDB_RAT}`,
	},
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
	host: "localhost",
	dialect: "mysql",
});

const recently_watched_ids = [
	"207564",
	"76758",
	"43865",
	"95479",
	"100565",
	"99778",
	"206799",
	"123542",
	"61901",
	"217766",
	"201363",
	"67075",
	"92602",
	"65249",
	"93816",
	"60863",
];

sequelize.authenticate().then(async () => {
	for (const i = 0; i < recently_watched_ids.length; ) {}
});
