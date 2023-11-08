require("dotenv").config();
const fetch = require("node-fetch");
const Sequelize = require("sequelize");
const TMDB_RAT = process.env.TMDB_RAT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const TOTAL_PAGES = 159;
const { Shows } = require("./models");
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

sequelize
	.authenticate()
	.then(async () => {
		console.log("Connection has been established successfully.");

		for (let i = 0; i <= TOTAL_PAGES; i++) {
			const url = `${base_url}&page=${i}`;
			await limiter.schedule(async () => {
				return fetch(url, options)
					.then((res) => res.json())
					.then(async (json) => {
						const show_array = [];
						for (const show of json.results) {
							show_array.push({
								tmdb_id: show["id"].toString(),
								title: show["name"],
								poster_path: show["poster_path"],
							});
						}
						try {
							await Shows.bulkCreate(show_array);
						} catch (e) {
							console.log(e);
						}
					})
					.then(() => {
						console.log(`Page ${i} complete.\n`);
					})
					.catch((err) => {
						console.error(
							`Error fetching and storing data: ${err}\nCurrent page: ${i}`
						);
					});
			});
		}
	})
	.catch((error) => {
		console.error("Unable to connect to the database: ", error);
	});
