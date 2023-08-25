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
		.setName("selectsuggestedshow")
		.setDescription("Select show from dropdown menu to add to watch list."),
	async execute(interaction) {
		// Command sent from non-owner
		if (!interaction.user.id in admins) {
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
		const receivedEmbed = interaction.message.embeds[0];
		const addedShow = interaction.values[0];
		client.watchList.push(addedShow);
		const newEmbed = EmbedBuilder.from(receivedEmbed).setDescription(
			`${receivedEmbed.description}\n${addedShow}`
		);

		// Build Buttons
		const recentlyWatchedButton = new ButtonBuilder()
			.setLabel("Recently watched")
			.setCustomId("recentlywatchedbutton")
			.setStyle(ButtonStyle.Success);
		const suggestionsButton = new ButtonBuilder()
			.setLabel("Suggestions")
			.setCustomId("suggestionsbutton")
			.setStyle(ButtonStyle.Primary);

		const buttonRow = new ActionRowBuilder().addComponents(
			recentlyWatchedButton,
			suggestionsButton
		);

		await interaction.deferUpdate();
		await interaction.message
			.edit({
				embeds: [newEmbed],
				components: [buttonRow],
			})
			.then((msg) => {
				const index = client.suggestedShowsList.indexOf(addedShow);
				if (index > -1) {
					client.suggestedShowsList.splice(index, 1);
					//redraw suggestions embed
					const suggestedShowsEmbedStruct = client.embeds.get(
						"suggestedShowsEmbedStruct"
					);
					console.log(suggestedShowsEmbedStruct[0]);
				}
			});
	},
};
