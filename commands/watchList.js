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
		.setName("wl")
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

		// Build Watchlist Embed
		const watchlistEmbed = new EmbedBuilder()
			.setColor(0x00be92)
			.setTitle(`Watch List`)
			.setDescription(
				`--------------------------------------------------------------------\n
				Currently empty.`
			)
			.setThumbnail("https://i.imgur.com/xyfMF0v.png");

		// Build Watchlist Buttons
		const recentlyWatchedButton = new ButtonBuilder()
			.setLabel("Recently watched")
			.setCustomId("recentlywatchedbutton")
			.setStyle(ButtonStyle.Success);
		const suggestionsButton = new ButtonBuilder()
			.setLabel("Suggestions")
			.setCustomId("suggestionsbutton")
			.setStyle(ButtonStyle.Primary);

		// Build Watch List Action Rows
		const watchlistRow = new ActionRowBuilder().addComponents(
			recentlyWatchedButton,
			suggestionsButton
		);

		/*==============
		  SUGGESTION UI
		==============*/

		// Build Suggestion Embed
		const suggestionEmbed = new EmbedBuilder()
			.setColor(0x00be92)
			.setTitle(`Suggestions`)
			.setDescription(
				`--------------------------------------------------------------------\n
			Currently empty.`
			)
			.setThumbnail("https://i.imgur.com/SZJ5qq1.png")
			.setFooter({
				text: `Type:  /sg showname   to suggest a show.`,
			});

		// set watchlist state to true
		client.appStates.set("wl", true);

		// reply and delete reply
		const reply = await interaction.reply("Starting binger.");
		await reply.delete();

		// send watchlist embed and buttons to channel
		await interaction.channel
			.send({
				embeds: [watchlistEmbed],
				components: [watchlistRow],
			})
			// update client embeds struct collection
			.then((msg) => {
				client.embeds.set("watchlistEmbedStruct", [watchlistEmbed, msg]);
			});

		// send suggested embed to channel
		await interaction.channel
			.send({
				embeds: [suggestionEmbed],
			})
			//update client embeds struct collection
			.then((msg) => {
				client.embeds.set("suggestedShowsEmbedStruct", [suggestionEmbed, msg]);
			});
	},
};
