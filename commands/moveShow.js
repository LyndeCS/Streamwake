require("dotenv").config();
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const ownerId = process.env.OWNER_ID;
const adminId = process.env.ADMIN_ID;
const admins = [ownerId, adminId];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("move")
		.setDescription("Move position of a show in watchlist/suggestions.")
		.addStringOption((option) =>
			option
				.setName("list")
				.setDescription("The target list")
				.setRequired(true)
				.addChoices({ name: "wl", value: "wl" }, { name: "sl", value: "sl" })
		)
		.addIntegerOption((option) =>
			option
				.setName("startposition")
				.setDescription("Number of show on the list to move")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("endposition")
				.setDescription("Number on the list to move selected show to")
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
		const startpos = interaction.options.getInteger("startposition") - 1;
		const endpos = interaction.options.getInteger("endposition") - 1;

		// remove show from watchlist
		if (list === "wl") {
			// ensure watch list has corresponding element to value entered by user
			if (client.watchList.length > 0 && client.watchList.length > startpos) {
				const movedShowName = client.watchList[startpos]["showName"];
				client.watchList.splice(
					endpos,
					0,
					client.watchList.splice(startpos, 1)[0]
				);
				// reply to interaction, update wl embed if wl is active
				if (client.appStates.get("wl")) {
					client.emit("watchlistUpdate");
				}
				await interaction.reply({
					content: `Moved ${movedShowName} from ${startpos + 1} to ${
						endpos + 1
					}.`,
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
				client.suggestedShowsList.length > startpos
			) {
				const movedShowName = client.suggestedShowsList[startpos]["showName"];
				client.suggestedShowsList.splice(
					endpos,
					0,
					client.suggestedShowsList.splice(startpos, 1)[0]
				);
				// reply to interaction, update sg embed if wl is active
				if (client.appStates.get("wl")) {
					client.emit("suggestionsUpdate");
				}
				await interaction.reply({
					content: `Moved ${movedShowName} from ${startpos + 1} to ${
						endpos + 1
					}.`,
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
