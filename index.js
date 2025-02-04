const clientManager = require("./clientManager");
const config = require("./config.js");

// Load events before logging in
clientManager.loadEvents();
clientManager.loadCommands();
clientManager.loadCronJobs();

// Load the watchlist using the model
// clientManager.setWatchlistModel(TemporaryWatchlist);
clientManager.setWatchlistModel();
clientManager.loadWatchlist();

// Log in to Discord using the token from the config file
clientManager.login(config.bot.token);
