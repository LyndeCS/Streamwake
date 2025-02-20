const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Watchlist = sequelize.define(
		"Watchlist",
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
			position: {
				type: DataTypes.INTEGER,
			},
		},
		{
			tableName: "watchlist",
			timestamps: false,
		}
	);

	return Watchlist;
};
