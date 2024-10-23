const clientManager = require("./clientManager");
const config = require("./config.js");

// Load events before logging in
clientManager.loadEvents();
clientManager.loadCommands();
clientManager.loadCronJobs();

// Log in to Discord using the token from the config file
clientManager.login(config.bot.token);
