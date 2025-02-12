require("dotenv").config({
	path: `.env.${process.env.NODE_ENV || "development"}`,
});

module.exports = {
	// Bot configuration
	bot: {
		token: process.env.BOT_TOKEN,
		clientId: process.env.CLIENT_ID,
		guildId: process.env.GUILD_ID,
		adminArray: process.env.ADMIN_ARRAY.split(","),
		moderatorArray: process.env.MODERATOR_ARRAY.split(","),
	},

	// Database configuration
	db: {
		username: process.env.DB_USER,
		password: process.env.DB_PW,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		// Connection pooling settings for production
		// pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
	},
};
