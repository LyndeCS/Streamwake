// Import the clientManager to use the already established Sequelize connection
const clientManager = require("./clientManager");

// Access the Sequelize instance from clientManager
const { DataTypes } = require("sequelize");
const sequelize = clientManager.sequelize;

// Define the TemporaryWatchlist model
const TemporaryWatchlist = sequelize.define(
	"watchlist",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		show_name: {
			type: DataTypes.STRING,
		},
		season_number: {
			type: DataTypes.INTEGER,
		},
		episode_number: {
			type: DataTypes.INTEGER,
		},
		episode_name: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "watchlist",
		timestamps: false,
	}
);

// Export the model for use in other parts of your application
module.exports = TemporaryWatchlist;
