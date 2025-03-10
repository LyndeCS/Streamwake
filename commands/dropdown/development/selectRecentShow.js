require("dotenv").config();
const clientManager = require("../../../clientManager");
const client = clientManager.getClient();
const admins = process.env.ADMIN_ARRAY;
const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	MessageFlags,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("selectrecentshow")
		.setDescription("Select show from dropdown menu to add to watch list."),
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
	      SHOW SELECTED FROM DROPDOWN
        =============================*/

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

		// Update embed with selected show
		const addedShow = client.recentShowsList.find(
			(show) => show.showName === interaction.values[0]
		);
		addedShow.recent = true;
		addedShow.episode += 1;
		client.watchList.push(addedShow);

		await interaction.deferUpdate();
		client.emit("watchlistUpdate", buttonRow);
		const index = client.recentShowsDropdownList.findIndex(
			(show) => show.showName === addedShow.showName
		);
		if (index > -1) {
			client.recentShowsDropdownList.splice(index, 1);
		}
	},
};
