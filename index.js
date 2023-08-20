const clientManager = require("./clientManager");
const token = process.env.BOT_TOKEN;

// Load events before logging in
clientManager.loadEvents();

// Log in to Discord
clientManager.login(token);
