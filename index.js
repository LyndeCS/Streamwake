const clientManager = require("./clientManager");
const token = process.env.BOT_TOKEN;

// Load events before logging in
clientManager.loadEvents();
clientManager.loadCommands();

// Log in to Discord
clientManager.login(token);
