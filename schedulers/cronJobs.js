const cron = require("node-cron");
const { Watchlist, sequelize } = require("../models");
const client = require("../clientManager");

async function incrementEpisodeNumbers() {
	try {
		await Watchlist.increment("episode_number", {
			by: 1,
			where: {},
		});
		console.log("All episode numbers incremented by 1.");
	} catch (error) {
		console.error("Error incrementing episode numbers:", error);
	}
}

async function decrementEpisodeNumbers() {
	try {
		await Watchlist.decrement("episode_number", {
			by: 1,
			where: {},
		});
		console.log("All episode numbers decremented by 1.");
	} catch (error) {
		console.error("Error decrementing episode numbers:", error);
	}
}

// Schedule the task to run every Sunday at 3AM
cron.schedule("0 3 * * 0", async () => {
	try {
		await incrementEpisodeNumbers();
		client.loadWatchlist();
	} catch (error) {
		console.error("Error incrementing episode numbers:", error);
	}
});
