require("dotenv").config();
const wait = require("node:timers/promises").setTimeout;
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const ownerId = process.env.OWNER_ID;
const adminId = process.env.ADMIN_ID;
const admins = [ownerId, adminId];
const {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("suggestionsbutton")
		.setDescription("Open drop-down menu of suggested shows."),
	async execute(interaction) {
		// Command sent from non-owner
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
			return;
		}
		if (client.suggestedShowsList.length < 1) {
			const reply = await interaction.reply({
				content: "Suggested shows list is empty.",
				ephemeral: true,
			});
			await wait(3000);
			await reply.delete();
			return;
		}
		/*==================================
	        SUGGESTIONS BUTTON IS PRESSED
        ====================================*/

		// Build Suggestions Drop Down Menu
		const suggestionsMenu = new StringSelectMenuBuilder()
			.setCustomId("selectSuggestedShow")
			.setPlaceholder("Select a show");
		const suggestedShows = client.suggestedShowsList;
		for (let i = 0; i < suggestedShows.length; i++) {
			suggestionsMenu.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(suggestedShows[i]["showName"])
					.setValue(suggestedShows[i]["showName"])
			);
		}

		const receivedActionRow = interaction.message.components[0];
		const menuRow = new ActionRowBuilder().addComponents(suggestionsMenu);

		await interaction.deferUpdate();
		await interaction.message.edit({
			components: [receivedActionRow, menuRow],
		});
	},
};
