require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "dev"}` });

module.exports = {
	bot: {
		token: process.env.BOT_TOKEN,
		clientId: process.env.CLIENT_ID,
		guildId: process.env.GUILD_ID,
		adminArray: process.env.ADMIN_ARRAY.split(","),
	},
	db: {
		host: process.env.HOST,
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PW,
		tempName: process.env.TEMP_DB_NAME,
		tempUser: process.env.TEMP_DB_USER,
		tempPassword: process.env.TEMP_DB_PW,
	},
};
