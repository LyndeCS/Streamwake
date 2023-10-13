require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const TMDB_RAT = `Bearer ${process.env.TMDB_RAT}`;

const url = "https://api.themoviedb.org/3/search/keyword?query=anime&page=1";
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
		console.log(json);
	})
	.catch((err) => console.error("error:" + err));
