require("dotenv").config();
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const admins = process.env.ADMIN_ARRAY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("r")
		.setDescription("Remove a show from watchlist/suggestions.")
		.addStringOption((option) =>
			option
				.setName("list")
				.setDescription("The target list")
				.setRequired(true)
				.addChoices({ name: "wl", value: "wl" }, { name: "sl", value: "sl" })
		)
		.addIntegerOption((option) =>
			option
				.setName("position")
				.setDescription("Number on the list of show to remove")
				.setRequired(true)
		),
	async execute(interaction) {
		// Command sent from non-owner
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
			return;
		}
		// showname string is sent via /sg command
		const list = interaction.options.getString("list");
		const pos = interaction.options.getInteger("position") - 1;

		// remove show from watchlist
		if (list === "wl") {
			// ensure watch list has corresponding element to value entered by user
			if (client.watchList.length > 0 && client.watchList.length > pos) {
				const removedShowName = client.watchList[pos]["showName"];
				client.watchList.splice(pos, 1);
				// reply to interaction, update wl embed if wl is active
				if (client.appStates.get("wl")) {
					client.emit("watchlistUpdate");
				}
				await interaction.reply({
					content: `Removed ${removedShowName}.`,
					ephemeral: true,
				});
				// user entered invalid position to remove
			} else {
				await interaction.reply({
					content: `Invalid position entered.`,
					ephemeral: true,
				});
			}
			// remove show from suggestions
		} else {
			// ensure suggestions list has corresponding element to value entered by user
			if (
				client.suggestedShowsList.length > 0 &&
				client.suggestedShowsList.length > pos
			) {
				const removedShowName = client.suggestedShowsList[pos]["showName"];
				client.suggestedShowsList.splice(pos, 1);
				// reply to interaction, update sg embed if wl is active
				if (client.appStates.get("wl")) {
					client.emit("suggestionsUpdate");
				}
				await interaction.reply({
					content: `Removed ${removedShowName}.`,
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: `Invalid position entered.`,
					ephemeral: true,
				});
			}
		}
	},
};
