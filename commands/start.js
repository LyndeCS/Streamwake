require("dotenv").config();
const ownerId = process.env.OWNER_ID;
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("start")
		.setDescription(
			"Start the bot, initiating activity logging and opening menu."
		),
	async execute(interaction) {
		if (interaction.user.id !== ownerId) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		// Bot Menu
		const startEpButton = new ButtonBuilder()
			.setCustomId("Start Ep.")
			.setLabel("Start Episode")
			.setStyle(ButtonStyle.Success);
		const endEpButton = new ButtonBuilder()
			.setCustomId("End Ep.")
			.setLabel("End Episode")
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder().addComponents(
			startEpButton,
			endEpButton
		);

		await interaction.reply({
			content: "Binger Bot",
			components: [row],
		});
	},
};
