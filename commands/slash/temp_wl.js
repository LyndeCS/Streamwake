require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const wl = require("../../temp_models");
const { format, nextSaturday } = require("date-fns");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wl")
		.setDescription("View watchlist."),
	async execute(interaction) {
		// DATE
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
		const watchDay = dayOfWeek === 6 ? today : nextSaturday(new Date());
		const formattedDate = format(watchDay, "MMM dd");

		// FETCH
		const watchlistItems = await wl.findAll();

		// OUTPUT
		let responseText = `${formattedDate} Watchlist:\n`;
		watchlistItems.forEach((item) => {
			responseText += `- ${item.show_name}: S${item.season_number}E${item.episode_number}\n`;
		});

		await interaction.reply({ content: responseText, ephemeral: true });
	},
};
