const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "suggestionsUpdate",
	async execute() {
		// watchlist is active
		if (client.appStates.get("wl")) {
			const wlStruct = client.embeds.get("suggestedShowsEmbedStruct");
			const embed = wlStruct[0];
			const msg = wlStruct[1];
			const descHeader = `----------------------------------------------------------\n`;
			const emptyHeader = `Currently empty.`;
			let desc = client.suggestedShowsList.length
				? descHeader
				: descHeader + emptyHeader;
			for (let i = 0; i < client.suggestedShowsList.length; i++) {
				desc += `${i + 1}. **__${
					client.suggestedShowsList[i]["showName"]
				}__**\n`;
			}
			const newEmbed = EmbedBuilder.from(embed).setDescription(desc);

			await msg
				.edit({
					embeds: [newEmbed],
				})
				.then((msg) => {
					client.embeds.set("suggestedShowsEmbedStruct", [newEmbed, msg]);
				});
		}
	},
};
