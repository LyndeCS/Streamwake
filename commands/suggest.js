require("dotenv").config();
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
		if (!interaction.user.id in admins) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		// showname string is sent via /sg command
		const suggestedShow = interaction.options.getString("suggested_show");

		client.suggestedShowsList.push(suggestedShow);

		const reply = await interaction.reply("suggesting");
		reply.delete();

		const suggestedShowsEmbedStruct = client.embeds.get(
			"suggestedShowsEmbedStruct"
		);
		const suggestedShowsEmbed = suggestedShowsEmbedStruct[0];
		const newEmbed = EmbedBuilder.from(suggestedShowsEmbed)
			.setDescription("\u200B")
			.addFields({
				name: suggestedShow,
				value: "S01E02 - Pizza Dogs",
			});
		const suggestedShowsEmbedMsg = suggestedShowsEmbedStruct[1];
		await suggestedShowsEmbedMsg.edit({
			embeds: [newEmbed],
		});
	},
};
