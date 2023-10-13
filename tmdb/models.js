require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
	"your_database_name",
	"your_username",
	"your_password",
	{
		host: "your_database_host",
		dialect: "mysql",
		// Other options as needed
	}
);

const Users = sequelize.define("users", {
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
});

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
	}
);

const Episodes = sequelize.define("episodes", {
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
});

const Watchlist = sequelize.define("watchlist", {
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
});

const Suggestions = sequelize.define("suggestions", {
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
});

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
	}
);

const Shows = sequelize.define("shows", {
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
});

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
	}
);

const Services = sequelize.define("services", {
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
});

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
