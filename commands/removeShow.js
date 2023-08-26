require("dotenv").config();
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("r")
		.setDescription("Remove a show from watchlist/suggestions.")
		// .addSubcommand((subcommand) =>
		// 	subcommand
		// 		.setName("targetlist")
		// 		.setDescription("Target list to remove from (wl/sl)")
		// 		.addStringOption((option) =>
		// 			option
		// 				.setName("list")
		// 				.setDescription("The target list")
		// 				.setRequired(true)
		// 				.addChoices(
		// 					{ name: "wl", value: "wl" },
		// 					{ name: "sl", value: "sl" }
		// 				)
		// 		)
		// )
		// .addSubcommand((subcommand) =>
		// 	subcommand
		// 		.setName("position")
		// 		.setDescription("Number on the list of show to remove")
		// 		.addIntegerOption((option) =>
		// 			option
		// 				.setName("value")
		// 				.setDescription("Value of number to remove")
		// 				.setRequired(true)
		// 		)
		// ),
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
		// showname string is sent via /sg command
		const list = interaction.options.getString("list");
		const pos = interaction.options.getInteger("position");

		await interaction.reply({
			content: `${list}: ${pos}`,
			ephemeral: true,
		});
	},
};
