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

		let responseText = "Sept 7 Watchlist:\n";
		watchlistItems.forEach((item) => {
			responseText += `- ${item.show_name} - S${item.season_number}E${item.episode_number}: ${item.episode_name}\n`;
		});

		await interaction.reply({ content: responseText, ephemeral: true });
	},
};
