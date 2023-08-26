const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "watchlistUpdate",
	async execute(...args) {
		// hackjob fix for passing buttonRows for the time being
		let buttonRow;
		if (args.length > 1) {
			buttonRow = args[0];
		}

		// watchlist is active
		if (client.appStates.get("wl")) {
			const wlStruct = client.embeds.get("watchlistEmbedStruct");
			const embed = wlStruct[0];
			const msg = wlStruct[1];
			const descHeader = `--------------------------------------------------------------------\n`;
			const emptyHeader = `Currently empty.`;
			let desc = client.watchList.length
				? descHeader
				: descHeader + emptyHeader;
			for (let i = 0; i < client.watchList.length; i++) {
				const currShow = client.watchList[i];
				desc += `${i + 1}. **__${currShow.showName}__** - *S0${
					currShow.season
				}E0${currShow.recent ? currShow.episode + 1 : currShow.episode}*\n`;
			}
			const newEmbed = EmbedBuilder.from(embed).setDescription(desc);

			if (buttonRow) {
				await msg
					.edit({
						embeds: [newEmbed],
						components: [buttonRow],
					})
					.then((msg) => {
						client.embeds.set("watchlistEmbedStruct", [newEmbed, msg]);
					});
			} else {
				await msg
					.edit({
						embeds: [newEmbed],
					})
					.then((msg) => {
						client.embeds.set("watchlistEmbedStruct", [newEmbed, msg]);
					});
			}
		}
	},
};
