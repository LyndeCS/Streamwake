require("dotenv").config();
const clientManager = require("../../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sg")
		.setDescription("Suggest a show to add to the suggestion list.")
		.addStringOption((option) =>
			option
				.setName("suggested_show")
				.setDescription(
					"Name of show you would like to add to suggestion list."
				)
				.setRequired(true)
		),
	async execute(interaction) {
		// showname string is sent via /sg command
		const suggestedShow = interaction.options.getString("suggested_show");

		client.suggestedShowsList.push({
			showName: suggestedShow,
			season: 1,
			episode: 1,
			votes: 1,
			voters: [interaction.user.id],
		});

		const reply = await interaction.reply({
			content: "suggesting",
			ephemeral: true,
		});
		reply.delete();

		client.emit("suggestionsUpdate");
	},
};
