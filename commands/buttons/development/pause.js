require("dotenv").config();
const admins = process.env.ADMIN_ARRAY;
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
	MessageFlags,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause current episode."),
	async execute(interaction) {
		// Command sent from non-owner
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		/*===========================
		    PAUSE BUTTON IS PRESSED
        =============================*/
		const receivedEmbed = interaction.message.embeds[0];
		const newEmbed = EmbedBuilder.from(receivedEmbed).setAuthor({
			name: "Paused",
		});

		const receivedActionRow = interaction.message.components[0];
		const playButton = new ButtonBuilder()
			.setCustomId("play")
			.setStyle(ButtonStyle.Success)
			.setEmoji("<:playicon:1143415946992697414>")
			.setDisabled(false);
		const pauseButton = new ButtonBuilder()
			.setCustomId("pause")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:pauseicon:1143423347091308574>")
			.setDisabled(true);
		const endButton = new ButtonBuilder()
			.setCustomId("end")
			.setStyle(ButtonStyle.Primary)
			.setEmoji("<:checkicon:1143427910510845963>")
			.setDisabled(false);
		const nextButton = new ButtonBuilder()
			.setCustomId("next")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:nexticon:1143425125132275782>")
			.setDisabled(true);
		const newActionRow = ActionRowBuilder.from(receivedActionRow).setComponents(
			playButton,
			pauseButton,
			endButton,
			nextButton
		);

		// avoid replying and creating a new message
		await interaction.deferUpdate();

		await interaction.message.edit({
			embeds: [newEmbed],
			components: [newActionRow],
		});
	},
};
