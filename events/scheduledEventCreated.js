const clientManager = require("../clientManager");
const { Events } = require("discord.js");

module.exports = {
	name: Events.GuildScheduledEventCreate,
	async execute(guildScheduledEvent) {
		// Check if "Animaturday" is mentioned in the event name, case-insensitive
		console.log(`Event created: ${guildScheduledEvent.name}`);
		try {
			if (guildScheduledEvent.name.toLowerCase().includes("animaturday")) {
				const sortedWatchlist = await clientManager
					.getWatchlist()
					.sort((a, b) => (a.position > b.position ? 1 : -1));
				const maxShowTitleLength = Math.max(
					...sortedWatchlist.map((item) => item.show_name.length)
				);

				let output = "```\n";
				output += `#  | ${"Show Title".padEnd(maxShowTitleLength)} | S | E\n`;

				output += `---+${"-".repeat(maxShowTitleLength + 2)}+---+---\n`;

				for (const item of sortedWatchlist) {
					output += `${item.position}. | ${item.show_name.padEnd(
						maxShowTitleLength
					)} | ${item.season_number} | ${item.episode_number}\n`;
				}

				output += "```";
				let eventDescription = ``;
				sortedWatchlist.forEach((item) => {
					eventDescription += `${item.position}. ${item.show_name}: s${item.season_number} e${item.episode_number}\n`;
				});

				// Update the event description
				await guildScheduledEvent.edit({
					description: eventDescription,
				});

				console.log(
					`Updated description for event: ${guildScheduledEvent.name}`
				);
			}
		} catch (error) {
			console.error("Error updating event description:", error);
		}
	},
};
