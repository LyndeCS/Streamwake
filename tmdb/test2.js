require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const TMDB_RAT = process.env.TMDB_RAT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
	host: "localhost",
	dialect: "mysql",
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((error) => {
		console.error("Unable to connect to the database: ", error);
	});

// const url =
// 	"https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=true&sort_by=primary_release_date.asc&with_genres=16&with_keywords=210024";
// const options = {
// 	method: "GET",
// 	headers: {
// 		accept: "application/json",
// 		Authorization: `Bearer ${TMDB_RAT}`,
// 	},
// };

// for (const i = 0; i < 10; i++) {

// }

// // 1 second delay
// setTimeout(function(){
//     console.log("Executed after 1 second");
// }, 1000);

// fetch(url, options)
// 	.then((res) => res.json())
// 	.then((json) => {
// 		console.log(json);
// 	})
// 	.catch((err) => console.error("error:" + err));
