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
		.setName("wl")
		.setDescription("Open watchlist UI."),
	async execute(interaction) {
		if (!interaction.user.id in admins) {
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
			.setAuthor({
				name: "ANIMATURDAY",
			})
			.setTitle(`Watch List - ${new Date().toLocaleDateString()}`)
			.setDescription(`Currently empty.`)
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
			// .setAuthor({
			// 	name: "ANIMATURDAY",
			// })
			.setTitle(`Suggestion List - ${new Date().toLocaleDateString()}`)
			.setDescription(`Currently empty.`)
			.setThumbnail("https://i.imgur.com/SZJ5qq1.png")
			.setFooter({
				text: `Type:  /sg showname   to suggest a show.`,
			});

		// // Build Suggestion Buttons
		// const addAllSuggestionButton = new ButtonBuilder()
		// 	.setCustomId("addallsuggestion")
		// 	.setStyle(ButtonStyle.Success)
		// 	.setLabel("Add all to watch list");
		// const addOneSuggestionButton = new ButtonBuilder()
		// 	.setCustomId("addonesuggestion")
		// 	.setStyle(ButtonStyle.Primary)
		// 	.setLabel("Add one to watch list");

		// // Build Suggestion List Rows
		// const suggestionRow = new ActionRowBuilder().addComponents(
		// 	addAllSuggestionButton,
		// 	addOneSuggestionButton
		// );

		const reply = await interaction.reply("Starting binger.");
		await reply.delete();
		await interaction.channel.send({
			embeds: [watchlistEmbed],
			components: [watchlistRow],
		});
		const suggestionEmbedMsg = await interaction.channel.send({
			embeds: [suggestionEmbed],
			// components: [suggestionRow],
		});

		client.embeds.set("suggestedShowsEmbedStruct", [
			suggestionEmbed,
			suggestionEmbedMsg,
		]);
		// client.suggestedShowsEmbedMsg = suggestionEmbedMsg;
	},
};
