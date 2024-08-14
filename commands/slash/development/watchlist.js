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
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("watchlist")
		.setDescription("Open watchlist UI."),
	async execute(interaction) {
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		/*==============
		  WATCHLIST UI
		==============*/

		// if watchlist embed already exists
		// if (client.embeds.get("watchlist")) {
		// }

		// Build Watchlist Embed
		const watchlistEmbed = new EmbedBuilder()
			.setColor(0x00be92)
			.setTitle(`Watch List`)
			.setDescription(
				`--------------------------------------------------------------------\n
				Currently empty.`
			)
			.setThumbnail("https://i.imgur.com/S3R7Ror.png");

		// Build Watchlist Buttons
		const recentlyWatchedButton = new ButtonBuilder()
			.setLabel("Recently watched")
			.setCustomId("recentlywatchedbutton")
			.setStyle(ButtonStyle.Primary);
		const suggestionsButton = new ButtonBuilder()
			.setLabel("Suggestions")
			.setCustomId("suggestionsbutton")
			.setStyle(ButtonStyle.Primary);
		const logButton = new ButtonBuilder()
			.setLabel("Start logging")
			.setCustomId("startlog")
			.setStyle(ButtonStyle.Secondary);
		const startButton = new ButtonBuilder()
			.setLabel("Start the show")
			.setCustomId("start")
			.setStyle(ButtonStyle.Success);

		// Build Watch List Action Rows
		const watchlistRow = new ActionRowBuilder().addComponents(
			recentlyWatchedButton,
			suggestionsButton,
			logButton,
			startButton
		);

		/*==============
		  SUGGESTION UI
		==============*/

		// Build Suggestion Embed
		const suggestionsEmbed = new EmbedBuilder()
			.setColor(0x00be92)
			.setTitle(`Suggestions`)
			.setDescription(
				`--------------------------------------------------------------------\n
			Currently empty.`
			)
			.setThumbnail("https://i.imgur.com/zAQ65B4.png")
			.setFooter({
				text: `Type:  /sg showname   to suggest a show, Type:  /vote showname   to vote for a show.`,
			});

		// set watchlist state to true
		client.appStates.set("wl", true);

		// reply and delete reply
		const reply = await interaction.reply("Starting Streamwake.");
		await reply.delete();

		// send watchlist embed and buttons to channel
		await interaction.channel
			.send({
				embeds: [watchlistEmbed],
				components: [watchlistRow],
			})
			// update client embeds struct collection
			.then((msg) => {
				client.embeds.set("watchlist", { embed: watchlistEmbed, msg: msg });
				client.emit("watchlistUpdate");
			});

		// send suggested embed to channel
		await interaction.channel
			.send({
				embeds: [suggestionsEmbed],
			})
			//update client embeds struct collection
			.then((msg) => {
				client.embeds.set("suggestions", { embed: suggestionsEmbed, msg: msg });
				client.emit("suggestionsUpdate");
			});
	},
};
