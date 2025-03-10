require("dotenv").config();
const clientManager = require("../../../clientManager");
const client = clientManager.getClient();
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
		.setName("start")
		.setDescription("Start watching and open the player UI."),
	async execute(interaction) {
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!client.watchList.length) {
			await interaction.reply({
				content: "Watchlist is empty.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		// Build Buttons
		const playButton = new ButtonBuilder()
			.setCustomId("play")
			.setStyle(ButtonStyle.Success)
			.setEmoji("<:playicon:1143415946992697414>");
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
			.setStyle(ButtonStyle.Secondary)
			.setEmoji("<:nexticon:1143425125132275782>")
			.setDisabled(true);

		const row = new ActionRowBuilder().addComponents(
			playButton,
			pauseButton,
			endButton,
			nextButton
		);

		const currShow = client.watchList[0];

		// Build Embed
		const menu = new EmbedBuilder()
			.setColor(0x00be92)
			.setAuthor({
				name: "Up next",
			})
			.setTitle(
				`${currShow.showName} - S0${currShow.season}E0${currShow.episode}`
			);
		if (currShow.url) {
			menu
				.setTitle(
					`${currShow.showName} - S0${currShow.season}E0${currShow.episode}: ${currShow.episodeName}`
				)
				.setURL(currShow.url)
				.setThumbnail(currShow.thumbnail)
				.setDescription(`*${currShow.desc}*`);
		}

		const reply = await interaction.reply({
			content: "Loading player...",
			flags: MessageFlags.Ephemeral,
		});
		await reply.delete();

		client.appStates.set("player", true);
		await interaction.channel
			.send({
				embeds: [menu],
				components: [row],
			})
			.then((msg) => client.embeds.set("player", { embed: menu, msg: msg }));
	},
};
