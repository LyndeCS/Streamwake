require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const TMDB_RAT = `Bearer ${process.env.TMDB_RAT}`;

const url =
	"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=true&language=en-US&sort_by=primary_release_date.asc&with_genres=anime";
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization:
			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzcxNDYwYTllY2YyMzIwZmNjMWE4YWVmZjkyYmI0ZiIsInN1YiI6IjY1MjNiNTE2ZWE4NGM3MDEwYzE4MzUxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m8qcrCLWglPvLeVR1KJeCH8cGjCNgxwUPP0l9azd1iA",
	},
};

fetch(url, options)
	.then((res) => res.json())
	.then((json) => {
		console.log(json);

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
