const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize(
	config.db.tempName,
	config.db.tempUser,
	config.db.tempPassword,
	{
		host: config.db.host,
		dialect: "mysql",
		logging: console.log,
	}
);

module.exports = sequelize;
