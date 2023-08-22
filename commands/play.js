require("dotenv").config();
const ownerId = process.env.OWNER_ID;
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Begin playing episode."),
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
		    PLAY BUTTON IS PRESSED
        =============================*/

		// Make play button disabled
		const receivedEmbed = interaction.message.embeds[0];
		const newEmbed = EmbedBuilder.from(receivedEmbed).setAuthor({
			name: "Now playing",
		});

		const receivedActionRow = interaction.message.components[0];
		const playButton = new ButtonBuilder()
			.setCustomId("play")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:playicon:1143415946992697414>")
			.setDisabled(true);
		const pauseButton = new ButtonBuilder()
			.setCustomId("pause")
			.setStyle(ButtonStyle.Primary)
			.setEmoji("<:pauseicon:1143423347091308574>")
			.setDisabled(false);
		const endButton = new ButtonBuilder()
			.setCustomId("end")
			.setStyle(ButtonStyle.Success)
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

		await interaction.reply({ components: [newActionRow], embeds: [newEmbed] });

		// Make pause button not disabled
		// Make stop button not disabled
	},
};
