require("dotenv").config();
const Sequelize = require("sequelize");
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const { Users } = require("./models");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
	host: "localhost",
	dialect: "mysql",
});

const user_array = [
	{
		discord_id: "130610762006659072",
		username: "vicez",
		name: "Chris",
	},
	{
		discord_id: "227951089884987392",
		username: "j_dawwg",
		name: "Jordan",
	},
	{
		discord_id: "129003108238884865",
		username: "alt_hero",
		name: "Ian",
	},
	{
		discord_id: "126458628717674497",
		username: "xoj_",
		name: "Jeremiah",
	},
	{
		discord_id: "790414827767201793",
		username: "nikare.",
		name: "Karen",
	},
	{
		discord_id: "263551086214905858",
		username: "vikven",
		name: "Viktor",
	},
	{
		discord_id: "692460565049901157",
		username: "jiren4star",
		name: "Layne",
	},
	{
		discord_id: "193871869072506880",
		username: "memeplug",
		name: "Ethan",
	},
];

// sequelize
// 	.authenticate()
// 	.then(() => {
// 		console.log("Connection has been established successfully.");
// 		try {
// 			Users.bulkCreate(user_array);
// 		} catch (e) {
// 			console.log(e);
// 		}
// 	})
// 	.catch((error) => {
// 		console.error("Unable to connect to the database: ", error);
// 	});
