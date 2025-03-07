require("dotenv").config();
const clientManager = require("../../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const admins = process.env.ADMIN_ARRAY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("showtables")
		.setDescription("Display all tables from database."),
	async execute(interaction) {
		// Command sent from non-owner
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		// equivalent to: SELECT name FROM tags;
		const tagList = await Tags.findAll({ attributes: ["name"] });
		const tagString = tagList.map((t) => t.name).join(", ") || "No tags set.";

		await interaction.reply(`List of tags: ${tagString}`);
	},
};
