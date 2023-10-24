require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

// Define the "users" model
const User = sequelize.define(
	"users",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		discord_id: DataTypes.STRING,
		username: DataTypes.STRING,
		name: DataTypes.STRING,
	},
	{
		tableName: "users",
		timestamps: true,
	}
);

// Define the "show_services" model
const ShowService = sequelize.define(
	"show_services",
	{
		service_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		show_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		url: DataTypes.STRING,
	},
	{
		tableName: "show_services",
		timestamps: true,
	}
);

// Define the "episodes" model
const Episode = sequelize.define(
	"episodes",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		tmdb_id: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		season_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		number: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		air_date: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		description: {
			type: Sequelize.STRING(1024),
			allowNull: true,
		},
		runtime: {
			type: Sequelize.FLOAT(8, 2),
			allowNull: true,
		},
	},
	{
		tableName: "episodes",
		timestamps: true,
	}
);

// Define the "watchlist" model
const Watchlist = sequelize.define(
	"watchlist",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		episode_id: DataTypes.INTEGER,
		position: DataTypes.TINYINT,
	},
	{
		tableName: "watchlist",
		timestamps: true,
	}
);

// Define the "suggestions" model
const Suggestion = sequelize.define(
	"suggestions",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		show_id: DataTypes.INTEGER,
	},
	{
		tableName: "suggestions",
		timestamps: true,
	}
);

// Define the "episode_links" model
const EpisodeLink = sequelize.define(
	"episode_links",
	{
		episode_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		service_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		url: DataTypes.STRING,
	},
	{
		tableName: "episode_links",
		timestamps: true,
	}
);

// Define the "shows" model
const Show = sequelize.define(
	"shows",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		tmdb_id: { type: DataTypes.STRING, allowNull: false },
		title: { type: DataTypes.STRING, allowNull: false },
		poster_path: DataTypes.STRING,
	},
	{
		tableName: "shows",
		timestamps: true,
	}
);

// Define the "votes" model
const Vote = sequelize.define(
	"votes",
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		suggestion_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
	},
	{
		tableName: "votes",
		timestamps: true,
	}
);

// Define the "seasons" model
const Season = sequelize.define(
	"seasons",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		tmdb_id: DataTypes.STRING,
		show_id: DataTypes.INTEGER,
		number: DataTypes.SMALLINT,
		title: DataTypes.STRING,
		poster_path: DataTypes.STRING,
	},
	{
		tableName: "seasons",
		timestamps: true,
	}
);

// Define the "services" model
const Service = sequelize.define(
	"services",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: DataTypes.STRING,
		priority: DataTypes.TINYINT,
	},
	{
		tableName: "services",
		timestamps: true,
	}
);

// Define the "user_episodes" model
const UserEpisode = sequelize.define(
	"user_episodes",
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		episode_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		watched_date: DataTypes.DATE,
	},
	{
		tableName: "user_episodes",
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ["user_id", "episode_id"],
			},
		],
	}
);

// Define associations (foreign keys) between models
User.hasMany(UserEpisode, { foreignKey: "user_id" });
UserEpisode.belongsTo(User, { foreignKey: "user_id" });
Watchlist.belongsTo(Episode, { foreignKey: "episode_id" });
Episode.belongsTo(Season, { foreignKey: "season_id" });
ShowService.belongsTo(Service, { foreignKey: "service_id" });
ShowService.belongsTo(Show, { foreignKey: "show_id" });
EpisodeLink.belongsTo(Service, { foreignKey: "service_id" });
EpisodeLink.belongsTo(Episode, { foreignKey: "episode_id" });
Suggestion.belongsTo(Show, { foreignKey: "id" });
Vote.belongsTo(User, { foreignKey: "user_id" });
Vote.belongsTo(Suggestion, { foreignKey: "suggestion_id" });
Season.belongsTo(Show, { foreignKey: "show_id" });
Show.hasMany(Season, { foreignKey: "show_id" });
Season.hasMany(Episode, { foreignKey: "season_id" });

// Synchronize the models with the database
sequelize
	.sync()
	.then(() => {
		console.log("Synchronizing complete.");
	})
	.catch((error) => {
		console.error("Error synchronizing the database:", error);
	});

module.exports = {
	sequelize,
	User,
	ShowService,
	Episode,
	Watchlist,
	Suggestion,
	EpisodeLink,
	Show,
	Vote,
	Season,
	Service,
	UserEpisode,
};
