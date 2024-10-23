require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const wl = require("../../temp_models");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wl")
		.setDescription("View watchlist."),
	async execute(interaction) {
		const watchlistItems = await wl.findAll();

		let responseText = "Oct 26 Watchlist:\n";
		watchlistItems.forEach((item) => {
			// responseText += `- ${item.show_name} - S${item.season_number}E${item.episode_number}: ${item.episode_name}\n`;
			responseText += `- ${item.show_name}: S${item.season_number}E${item.episode_number}\n`;
		});

		await interaction.reply({ content: responseText, ephemeral: true });
	},
};
