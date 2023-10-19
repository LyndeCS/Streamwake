require("dotenv").config();
const fetch = require("node-fetch");
const Sequelize = require("sequelize");
const TMDB_RAT = process.env.TMDB_RAT;
const { Show, Season, Episode, sequelize } = require("./models");
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
	maxConcurrent: 1, // Number of concurrent requests
	minTime: 1000, // Minimum time (in milliseconds) between requests
});

const base_url = `https://api.themoviedb.org/3/tv/{series_id}`;
const season_url = `/season/{season_number}`;
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${TMDB_RAT}`,
	},
};

sequelize
	.authenticate()
	.then(() => {
		Season.findAll({
			attributes: ["tmdb_id"],
		}).then((seasons) => {
			const tmdbIds = seasons.map((season) => season.tmdb_id);
			console.log(tmdbIds);
		});
	})
	// .then(async () => {
	// 	for (let i = 2; i < recently_watched_ids.length; i++) {
	// 		const url = `${base_url}${recently_watched_ids[i]}`;
	// 		await limiter.schedule(async () => {
	// 			return fetch(url, options)
	// 				.then((res) => res.json())
	// 				.then(async (season_data) => {
	// 					Show.findOne({
	// 						where: {
	// 							tmdb_id: recently_watched_ids[i],
	// 						},
	// 					})
	// 						.then((show) => {
	// 							if (show) {
	// 								const showId = show.id;
	// 								const season_data_array = [];
	// 								for (const season of season_data.seasons) {
	// 									if (season.name !== "Specials") {
	// 										season_data_array.push({
	// 											tmdb_id: season["id"].toString(),
	// 											show_id: showId,
	// 											number: season.season_number,
	// 											title: season.name,
	// 											poster_path: season.poster_path,
	// 										});
	// 									}
	// 								}
	// 								return Season.bulkCreate(season_data_array);
	// 							} else {
	// 								console.log("Show not found with tmdb_id:", tmdbIdToFind);
	// 							}
	// 						})
	// 						.then((bulk_create_return) => {
	// 							console.log(bulk_create_return);
	// 						})
	// 						.catch((error) => {
	// 							console.error("Error:", error);
	// 						});
	// 				})
	// 				.catch((err) => {
	// 					console.error(`${err}`);
	// 				});
	// 		});
	// 	}
	// })
	.catch((error) => {
		console.error("Unable to connect to the database: ", error);
	});
