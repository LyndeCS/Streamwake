require("dotenv").config({
	path: `.env.${process.env.NODE_ENV || "development"}`,
});

module.exports = {
	development: {
		username: process.env.TEMP_DB_USER,
		password: process.env.TEMP_DB_PW,
		database: process.env.TEMP_DB_NAME,
		host: "137.184.65.250",
		dialect: "mysql",
	},
	production: {
		username: process.env.TEMP_DB_USER,
		password: process.env.TEMP_DB_PW,
		database: process.env.TEMP_DB_NAME,
		host: process.env.HOST,
		dialect: "mysql",
		// For production, you might also want to configure:
		// "pool": { "max": 5, "min": 0, "acquire": 30000, "idle": 10000 } // Connection pooling
	},
};
