require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const admins = process.env.ADMIN_ARRAY;
const {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("recentlywatchedbutton")
		.setDescription("Open drop-down menu of recently watched shows."),
	async execute(interaction) {
		// Command sent from non-owner
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
			return;
		}
		/*==================================
	      RECENTLY WATCHED BUTTON IS PRESSED
        ====================================*/

		// Build Drop Down Menu
		const recentlyWatchedMenu = new StringSelectMenuBuilder()
			.setCustomId("selectRecentShow")
			.setPlaceholder("Select a show");
		for (let i = 0; i < client.recentShowsDropdownList.length; i++) {
			recentlyWatchedMenu.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(client.recentShowsDropdownList[i]["showName"])
					.setValue(client.recentShowsDropdownList[i]["showName"])
			);
		}
		const receivedActionRow = interaction.message.components[0];
		const menuRow = new ActionRowBuilder().addComponents(recentlyWatchedMenu);

		await interaction.deferUpdate();
		await interaction.message.edit({
			components: [receivedActionRow, menuRow],
		});
	},
};
