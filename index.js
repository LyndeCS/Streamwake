const clientManager = require("./clientManager");
const config = require("./config.js");
const wl = require("./temp_models");

// Load events before logging in
clientManager.loadEvents();
clientManager.loadCommands();
clientManager.loadCronJobs();

// Load the watchlist using the model
clientManager.loadWatchlist(wl);

// Log in to Discord using the token from the config file
clientManager.login(config.bot.token);
