require("dotenv").config();
const fetch = require("node-fetch");
const Sequelize = require("sequelize");
const TMDB_RAT = process.env.TMDB_RAT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const { Show, Season } = require("./models");
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

// sequelize
// 	.authenticate()
// 	.then(async () => {
// 		for (let i = 2; i < recently_watched_ids.length; i++) {
// 			const url = `${base_url}${recently_watched_ids[i]}`;
// 			await limiter.schedule(async () => {
// 				return fetch(url, options)
// 					.then((res) => res.json())
// 					.then(async (season_data) => {
// 						Show.findOne({
// 							where: {
// 								tmdb_id: recently_watched_ids[i],
// 							},
// 						})
// 							.then((show) => {
// 								if (show) {
// 									const showId = show.id;
// 									const season_data_array = [];
// 									for (const season of season_data.seasons) {
// 										if (season.name !== "Specials") {
// 											season_data_array.push({
// 												tmdb_id: season["id"].toString(),
// 												show_id: showId,
// 												number: season.season_number,
// 												title: season.name,
// 												poster_path: season.poster_path,
// 											});
// 										}
// 									}
// 									return Season.bulkCreate(season_data_array);
// 								} else {
// 									console.log("Show not found with tmdb_id:", tmdbIdToFind);
// 								}
// 							})
// 							.then((bulk_create_return) => {
// 								console.log(bulk_create_return);
// 							})
// 							.catch((error) => {
// 								console.error("Error:", error);
// 							});
// 					})
// 					.catch((err) => {
// 						console.error(`${err}`);
// 					});
// 			});
// 		}
// 	})
// 	.catch((error) => {
// 		console.error("Unable to connect to the database: ", error);
// 	});
