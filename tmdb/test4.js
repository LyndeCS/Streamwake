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
		// Query the Seasons table to retrieve records with show_id
		Season.findAll({
			attributes: ["show_id", "tmdb_id"], // Retrieve show_id and tmdb_id
		})
			.then((seasons) => {
				// Extract the show_id and tmdb_id values from Season records
				const seasonData = seasons.map((season) => ({
					showId: season.show_id,
					seasonTmdbId: season.tmdb_id,
				}));

				// Create an array to store objects with show_id and tmdb_id from Shows table
				const combinedData = [];

				// Query the Shows table to retrieve tmdb_id for each show_id
				Promise.all(
					seasonData.map((season) => {
						return Show.findOne({
							where: { id: season.showId },
							attributes: ["tmdb_id"],
						}).then((show) => {
							if (show) {
								combinedData.push({
									showId: season.showId,
									showTmdbId: show.tmdb_id,
									seasonTmdbId: season.seasonTmdbId,
								});
							}
						});
					})
				)
					.then(() => {
						// Now we fetch episode data using show/season ids
						for (const seasonObj of combinedData) {
							console.log(seasonObj);
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	})
	.catch((error) => {
		console.error("Unable to connect to the database: ", error);
	});
