require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(TEMP_DB_NAME, TEMP_DB_USER, TEMP_DB_PW, {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const TemporaryWatchlist = sequelize.define(
	"temporaryWatchlist",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		showName: {
			type: Sequelize.STRING,
		},
		seasonNumber: {
			type: Sequelize.INTEGER,
		},
		episodeNumber: {
			type: Sequelize.INTEGER,
		},
	},
	{
		tableName: "temporary_watchlist",
		timestamps: false,
	}
);

module.exports = TemporaryWatchlist;
