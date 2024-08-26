const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { Events } = require("discord.js");

module.exports = {
	name: Events.GuildScheduledEventCreate,
	async execute(guildScheduledEvent) {
		// Check if "Animaturday" is mentioned in the event name, case-insensitive
		console.log(`Event created: ${guildScheduledEvent.name}`);

		if (guildScheduledEvent.name.toLowerCase().includes("animaturday")) {
			// Fetch the watchlist from the database
			const watchlistItems =
				await clientManager.sequelize.models.watchlist.findAll();

			let eventDescription = "";
			watchlistItems.forEach((item) => {
				eventDescription += `- ${item.show_name} - S${item.season_number}E${item.episode_number}: ${item.episode_name}\n`;
			});

			// Update the event description
			await guildScheduledEvent.edit({
				description: eventDescription,
			});

			console.log(`Updated description for event: ${guildScheduledEvent.name}`);
		}
	},
};
