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

		// Build Buttons
		const playButton = new ButtonBuilder()
			.setCustomId("start")
			// .setLabel("Play")
			.setStyle(ButtonStyle.Success)
			.setEmoji("<:playicon:1143415946992697414>");
		const pauseButton = new ButtonBuilder()
			.setCustomId("pause")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:pauseicon:1143423347091308574>")
			.setDisabled(true);
		const endButton = new ButtonBuilder()
			.setCustomId("end")
			.setStyle(ButtonStyle.Primary)
			.setEmoji("<:checkicon:1143427910510845963>")
			.setDisabled(true);
		const nextButton = new ButtonBuilder()
			.setCustomId("next")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:nexticon:1143425125132275782>")
			.setDisabled(true);

		const row = new ActionRowBuilder().addComponents(
			playButton,
			pauseButton,
			endButton,
			nextButton
		);

		// Build Embed
		const menu = new EmbedBuilder()
			.setColor(0x00be92)
			.setAuthor({
				name: "Now playing",
			})
			.setTitle("Jujutsu Kaisen - S02E06: Pizza dogs")
			.setURL("https://www.crunchyroll.com/")
			.setThumbnail("https://i.imgur.com/pUaoPrt.jpg")
			.setDescription(`*"The audio is fucked btw."*`);
		//.addFields({ name: "\u200b", value: "\u200b" });

		await interaction.reply({
			components: [row],
			embeds: [menu],
		});
	},
};
