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
		.setName("selectshow")
		.setDescription("Select show from dropdown menu to add to watch list."),
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
	      SHOW SELECTED FROM DROPDOWN
        =============================*/

		// update embed with selected show
		// Build Embed
		const receivedEmbed = interaction.message.embeds[0];
		const newEmbed = EmbedBuilder.from(receivedEmbed).addFields({
			name: interaction.values[0],
			value: "S01E02 - Rolling Thunder",
		});

		// Build Buttons
		const addButton = new ButtonBuilder()
			.setCustomId("addshow")
			.setStyle(ButtonStyle.Success)
			.setEmoji("➕");

		const buttonRow = new ActionRowBuilder().addComponents(addButton);

		await interaction.deferUpdate();
		await interaction.message.edit({
			embeds: [newEmbed],
			components: [buttonRow],
		});
	},
};
