require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const Sequelize = require("sequelize");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
	host: "localhost",
	dialect: "mysql",
});

const Users = sequelize.define(
	"users",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		discord_id: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		username: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
	},
	{
		timestamps: true,
	}
);

const ShowServices = sequelize.define(
	"show_services",
	{
		service_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		show_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		url: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
	},
	{
		primaryKey: true,
		timestamps: true,
	}
);

const Episodes = sequelize.define(
	"episodes",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		show_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		season_number: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		episode_number: {
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
			type: Sequelize.STRING(512),
			allowNull: true,
		},
	},
	{
		timestamps: true,
	}
);

const Watchlist = sequelize.define(
	"watchlist",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		episode_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		position: {
			type: Sequelize.TINYINT,
			allowNull: false,
		},
	},
	{ tableName: "watchlist", timestamps: true }
);

const Suggestions = sequelize.define(
	"suggestions",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		show_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

const EpisodeLinks = sequelize.define(
	"episode_links",
	{
		episode_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		service_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		url: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
	},
	{
		primaryKey: true,
		timestamps: true,
	}
);

const Shows = sequelize.define(
	"shows",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		tmdb_id: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		poster_path: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
	},
	{
		timestamps: true,
	}
);

const Votes = sequelize.define(
	"votes",
	{
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		suggestion_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{
		primaryKey: true,
		timestamps: true,
	}
);

const Services = sequelize.define(
	"services",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		title: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		priority: {
			type: Sequelize.TINYINT,
			allowNull: true,
		},
	},
	{
		timestamps: true,
	}
);

const UserEpisodes = sequelize.define(
	"user_episodes",
	{
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		episode_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		watched_date: {
			type: Sequelize.DATE,
			allowNull: true,
		},
	},
	{
		primaryKey: true,
		timestamps: true,
	}
);

// Define associations between models
Episodes.belongsTo(Shows, { foreignKey: "show_id" });
EpisodeLinks.belongsTo(Services, { foreignKey: "service_id" });
Votes.belongsTo(Users, { foreignKey: "user_id" });
UserEpisodes.belongsTo(Users, { foreignKey: "user_id" });
UserEpisodes.belongsTo(Episodes, { foreignKey: "episode_id" });
Watchlist.belongsTo(Episodes, { foreignKey: "episode_id" });
ShowServices.belongsTo(Services, { foreignKey: "service_id" });
ShowServices.belongsTo(Shows, { foreignKey: "show_id" });
EpisodeLinks.belongsTo(Episodes, { foreignKey: "episode_id" });
UserEpisodes.belongsTo(Episodes, { foreignKey: "episode_id" });
Suggestions.belongsTo(Shows, { foreignKey: "show_id" });
Votes.belongsTo(Suggestions, { foreignKey: "suggestion_id" });

// Synchronize the models with the database
sequelize
	.sync()
	.then(() => {
		console.log("Database and tables created!");
	})
	.catch((error) => {
		console.error("Error synchronizing the database:", error);
	});

module.exports = {
	Users,
	ShowServices,
	Episodes,
	Watchlist,
	Suggestions,
	EpisodeLinks,
	Shows,
	Votes,
	Services,
	UserEpisodes,
};
