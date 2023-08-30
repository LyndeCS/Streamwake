require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("vote")
		.setDescription("Vote for a show on suggestions list.")
		.addStringOption((option) =>
			option
				.setName("show")
				.setDescription("Name of show you would like to vote for.")
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		// dynamically add autocomplete options as shows are suggested
		const focusedValue = interaction.options.getFocused().toLowerCase();

		const filtered = client.suggestedShowsList
			.filter((show) => show.showName.toLowerCase().startsWith(focusedValue))
			.map(({ showName: name, showName: value }) => ({
				name,
				value,
			}));

		await interaction.respond(filtered);
	},
	async execute(interaction) {
		// get show
		const showName = interaction.options.getString("show");

		// show not found in suggestedShowsList
		if (!client.suggestedShowsList.find((show) => show.showName === showName)) {
			const reply = await interaction.reply({
				content: "Show is not on suggestion list.",
				ephemeral: true,
			});
			setTimeout(() => reply.delete(), 2000);
			return;
		}

		// get show object
		const targetShow = client.suggestedShowsList.find(
			(show) => show.showName === showName
		);

		// if user has not voted on show, increment votes and add user to voters array
		if (!targetShow.voters.includes(interaction.user.id)) {
			targetShow.votes += 1;
			targetShow.voters.push(interaction.user.id);

			// reorder suggestedShowsList
			client.suggestedShowsList.sort((a, b) => b.votes - a.votes);

			// update suggestions list embed
			client.emit("suggestionsUpdate");

			// respond
			const reply = await interaction.reply({
				content: `Voting for ${showName}.`,
				ephemeral: true,
			});
			setTimeout(() => reply.delete(), 2000);
			return;
		} else {
			// user has already voted for show

			// create confirmation message buttons
			const confirmButton = new ButtonBuilder()
				.setLabel("Remove vote")
				.setCustomId("confirm")
				.setStyle(ButtonStyle.Primary);
			const cancelButton = new ButtonBuilder()
				.setLabel("Cancel")
				.setCustomId("cancel")
				.setStyle(ButtonStyle.Secondary);
			const buttonRow = new ActionRowBuilder().addComponents(
				confirmButton,
				cancelButton
			);

			// ask user if they would like to remove their vote from specified show

			await interaction
				.reply({
					content:
						"You have already voted for this show. Would you like to remove your vote?",
					components: [buttonRow],
					ephemeral: true,
				})
				.then((msg) => {
					const timer = setTimeout(() => msg.delete(), 10_000);
					const filter = (i) => i.user.id === interaction.user.id;

					const collector = msg.createMessageComponentCollector({
						componentType: ComponentType.Button,
						filter,
						time: 10_000,
					});

					collector.on("collect", (i) => {
						clearTimeout(timer);
						if (i.customId === "confirm") {
							msg.delete();
							if (targetShow.votes === 1) {
								const index = client.suggestedShowsList.indexOf(
									(show) => show.showName === targetShow.showName
								);
								client.suggestedShowsList.splice(index, 1);

								// update suggestions embed
								client.emit("suggestionsUpdate");
							} else {
								// User confirms removing their vote and they are not the only voter
								// subtract vote and remove user from list of voters
								targetShow.votes -= 1;
								const index = targetShow.voters.indexOf(interaction.user.id);
								targetShow.voters.splice(index, 1);

								// update suggestions embed
								client.emit("suggestionsUpdate");
							}
						} else if (i.customId === "cancel") {
							msg.delete();
						}
					});

					collector.on("end", (collected) => {
						clearTimeout(timer);
					});
				});
		}
	},
};
