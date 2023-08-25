require("dotenv").config();
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sg")
		.setDescription("Suggest a show to add to the suggestion list.")
		.addStringOption((option) =>
			option
				.setName("suggested_show")
				.setDescription(
					"Name of show you would like to add to suggestion list."
				)
				.setRequired(true)
		),
	async execute(interaction) {
		// showname string is sent via /sg command
		const suggestedShow = interaction.options.getString("suggested_show");

		client.suggestedShowsList.push(suggestedShow);

		const reply = await interaction.reply("suggesting");
		reply.delete();

		// Only build embed if watchlist is currently displaying
		if (client.appStates.get("wl")) {
			const suggestedShowsEmbedStruct = client.embeds.get(
				"suggestedShowsEmbedStruct"
			);
			const suggestedShowsEmbed = suggestedShowsEmbedStruct[0];
			const suggestedShowsEmbedMsg = suggestedShowsEmbedStruct[1];
			const newEmbed = EmbedBuilder.from(suggestedShowsEmbed)
				.setDescription("\u200B")
				.addFields({
					name: suggestedShow,
					value: "1 vote",
					inline: true,
				});
			// client.embeds.set("suggestedShowsEmbedStruct", newEmbed);

			await suggestedShowsEmbedMsg
				.edit({
					embeds: [newEmbed],
				})
				.then((msg) => {
					client.embeds.set("suggestedShowsEmbedStruct", [newEmbed, msg]);
				});
		}
	},
};
