const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "watchlistUpdate",
	async execute(client) {
		// watchlist is active
		if (client.appStates.get("wl")) {
			const [embed, msg] = client.embeds.get("watchlistEmbedStruct");
			const descHeader = `----------------------------------------------------------\n`;
			const emptyHeader = `Currently empty.`;
			let desc = client.watchList.length
				? descHeader
				: descHeader + emptyHeader;
			for (let i = 0; i < client.watchList.length; i++) {
				desc += client.watchList[i] + "\n";
			}
			const newEmbed = EmbedBuilder.from(embed).setDescription(desc);

			await msg
				.edit({
					embeds: [newEmbed],
				})
				.then((msg) => {
					client.embeds.set("watchlistEmbedStruct", [newEmbed, msg]);
				});
		}
	},
};
