require("dotenv").config();
const DB_NAME = process.env.TEMP_DB_NAME;
const DB_USER = process.env.TEMP_DB_USER;
const DB_PW = process.env.TEMP_DB_PW;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const TemporaryWatchlist = sequelize.define(
	"watchlist",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		show_name: {
			type: Sequelize.STRING,
		},
		season_number: {
			type: Sequelize.INTEGER,
		},
		episode_number: {
			type: Sequelize.INTEGER,
		},
		episode_name: {
			type: Sequelize.STRING,
		},
	},
	{
		tableName: "watchlist",
		timestamps: false,
	}
);

module.exports = TemporaryWatchlist;
