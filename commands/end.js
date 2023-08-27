require("dotenv").config();
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const ownerId = process.env.OWNER_ID;
const adminId = process.env.ADMIN_ID;
const admins = [ownerId, adminId];
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("end")
		.setDescription("End current episode."),
	async execute(interaction) {
		// Command sent from non-owner
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
			return;
		}
		/*===========================
		    END BUTTON IS PRESSED
        =============================*/
		const receivedEmbed = interaction.message.embeds[0];
		const currShow = client.watchList[0];
		const nextShow = client.watchList[1];

		const newEmbed = EmbedBuilder.from(receivedEmbed).setAuthor({
			name: "Finished playing",
		});

		if (client.watchList.length > 1) {
			if (nextShow.url) {
				newEmbed
					.setFields(
						{ name: "\u200B", value: "\u200B" },
						{
							name: "Up next",
							value: `[${nextShow.showName} - S0${nextShow.season}E0${nextShow.episode}](${nextShow.url})`,
						}
					)
					.setImage(`${nextShow.thumbnail}`);
			} else {
				newEmbed.setFields(
					{ name: "\u200B", value: "\u200B" },
					{
						name: "Up next",
						value: `[${nextShow.showName} - S0${nextShow.season}E0${nextShow.episode}](https://www.crunchyroll.com)`,
					}
				);
			}
		}

		// Player button UI
		const receivedActionRow = interaction.message.components[0];
		const playButton = new ButtonBuilder()
			.setCustomId("play")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:playicon:1143415946992697414>")
			.setDisabled(true);
		const pauseButton = new ButtonBuilder()
			.setCustomId("pause")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:pauseicon:1143423347091308574>")
			.setDisabled(true);
		const endButton = new ButtonBuilder()
			.setCustomId("end")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:checkicon:1143427910510845963>")
			.setDisabled(true);
		const nextButton = new ButtonBuilder()
			.setCustomId("next")
			.setStyle(ButtonStyle.Success)
			.setEmoji("<:nexticon:1143425125132275782>")
			.setDisabled(false);
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
