require("dotenv").config();
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const ownerId = process.env.OWNER_ID;
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
		.setName("addshow")
		.setDescription("Add a show to the watch list."),
	async execute(interaction) {
		// Command sent from non-owner
		if (interaction.user.id !== ownerId) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
			return;
		}
		/*===========================
	      ADD SHOW BUTTON IS PRESSED
        =============================*/

		// Build Drop Down Menu
		const recentlyWatchedMenu = new StringSelectMenuBuilder()
			.setCustomId("showselection")
			.setPlaceholder("Select a show");
		for (let i = 0; i < client.recentShows.length; i++) {
			recentlyWatchedMenu.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(client.recentShows[i])
					.setValue(client.recentShows[i])
			);
		}

		const menuRow = new ActionRowBuilder().addComponents(recentlyWatchedMenu);

		await interaction.deferUpdate();
		await interaction.message.edit({
			components: [menuRow],
		});
	},
};
