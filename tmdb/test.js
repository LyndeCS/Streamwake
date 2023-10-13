require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const TMDB_RAT = `Bearer ${process.env.TMDB_RAT}`;

const url =
	"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=true&sort_by=primary_release_date.asc&with_genres=16&with_keywords=210024";
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: TMDB_RAT,
	},
};

fetch(url, options)
	.then((res) => res.json())
	.then((data) => {
		const results = data.results;

		// for (const show of results) {
		// 	console.log(show.id, show.name);
		// }

		const numPages = data.total_pages;
		console.log(numPages);

		// // Log to a file
		// let testMessage = JSON.stringify(json);
		// const testFilePath = path.join(__dirname, "..", "test", "test.log");

		// // Create the directory if it doesn't exist
		// const testDirectory = path.join(__dirname, "..", "test");
		// if (!fs.existsSync(testDirectory)) {
		// 	fs.mkdirSync(testDirectory);
		// }

		// // Append message to the file
		// fs.appendFileSync(testFilePath, testMessage);
	})
	.catch((err) => console.error("error:" + err));
