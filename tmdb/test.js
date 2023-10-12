require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const TMDB_RAT = `Bearer ${process.env.TMDB_RAT}`;

const url =
	"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=true&page=1&sort_by=primary_release_date.desc&with_genres=anime";
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: TMDB_RAT,
	},
};

fetch(url, options)
	.then((res) => res.json())
	.then((json) => {
		console.log(json.results[0]["name"]);

		// for (const result in results) {
		// }

		// Log to a file
		let testMessage = JSON.stringify(json);
		const testFilePath = path.join(__dirname, "..", "test", "test.log");

		// Create the directory if it doesn't exist
		const testDirectory = path.join(__dirname, "..", "test");
		if (!fs.existsSync(testDirectory)) {
			fs.mkdirSync(testDirectory);
		}

		// Append message to the file
		fs.appendFileSync(testFilePath, testMessage);
	})
	.catch((err) => console.error("error:" + err));
