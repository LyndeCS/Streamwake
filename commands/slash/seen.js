require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const { User, Episode, UserEpisode, Show, Season } = require("../../models");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("seen")
		.setDescription("Create a record of watching an episode of a show.")
		.addStringOption((option) =>
			option
				.setName("seen_episode")
				.setDescription("Name of show you would like to create a record for.")
				.setRequired(true)
		),
	async execute(interaction) {
		const reply = await interaction.reply({
			content: "suggesting",
			ephemeral: true,
		});
		reply.delete();
	},
};
