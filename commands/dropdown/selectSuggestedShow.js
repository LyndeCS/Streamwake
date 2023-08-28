require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const admins = process.env.ADMIN_ARRAY;
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
		.setName("selectsuggestedshow")
		.setDescription("Select show from dropdown menu to add to watch list."),
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
	      SHOW SELECTED FROM DROPDOWN
        =============================*/

		// Update embed with selected show
		const addedShow = client.suggestedShowsList.find(
			(show) => show.showName === interaction.values[0]
		);
		addedShow.recent = false;
		client.watchList.push(addedShow);

		// Build Buttons
		const recentlyWatchedButton = new ButtonBuilder()
			.setLabel("Recently watched")
			.setCustomId("recentlywatchedbutton")
			.setStyle(ButtonStyle.Primary);
		const suggestionsButton = new ButtonBuilder()
			.setLabel("Suggestions")
			.setCustomId("suggestionsbutton")
			.setStyle(ButtonStyle.Primary);
		const startButton = new ButtonBuilder()
			.setLabel("Start watching")
			.setCustomId("start")
			.setStyle(ButtonStyle.Success);
		const logButton = new ButtonBuilder()
			.setLabel("Start logging")
			.setCustomId("startlog")
			.setStyle(ButtonStyle.Secondary);
		const buttonRow = new ActionRowBuilder().addComponents(
			recentlyWatchedButton,
			suggestionsButton,
			logButton,
			startButton
		);

		await interaction.deferUpdate();
		client.emit("watchlistUpdate", buttonRow);
		const index = client.suggestedShowsList.findIndex(
			(show) => show.showName === addedShow.showName
		);
		if (index > -1) {
			client.suggestedShowsList.splice(index, 1);
			client.emit("suggestionsUpdate");
		}
	},
};
