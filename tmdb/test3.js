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

const base_url = "https://api.themoviedb.org/3/tv/";
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

sequelize
	.authenticate()
	.then(() => {
		// for (const i = 0; i < recently_watched_ids.length; i++) {}
		const url = `${base_url}95479`;
		const episode_group = `https://api.themoviedb.org/3/tv/episode_group/{tv_episode_group_id}`;
		const episode_url = `https://api.themoviedb.org/3/tv/95479/season/2/episode/1`;
		fetch(url, options)
			.then((res) => res.json())
			.then((show) => {
				// console.log(`Name: ${show.name}`);
				// console.log(`Seasons: ${show.number_of_seasons}`);
				// console.log(`Episodes: ${show.number_of_episodes}`);
				console.log(show.seasons);
			})
			.catch((err) => {
				console.error(`${err}`);
			});
	})
	.catch((error) => {
		console.error("Unable to connect to the database: ", error);
	});
