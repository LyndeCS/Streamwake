const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "watchlistUpdate",
	async execute(buttonRow, recent) {
		// watchlist is active
		if (client.appStates.get("wl")) {
			const wlStruct = client.embeds.get("watchlistEmbedStruct");
			const embed = wlStruct[0];
			const msg = wlStruct[1];
			const descHeader = `----------------------------------------------------------\n`;
			const emptyHeader = `Currently empty.`;
			let desc = client.watchList.length
				? descHeader
				: descHeader + emptyHeader;
			for (let i = 0; i < client.watchList.length; i++) {
				const currShow = client.watchList[i];
				if (recent) {
					const foundShow = client.recentShowsList.find(
						(show) => show.showName === currShow
					);
					console.log(currShow);
					console.log(foundShow);
					desc += `${i}. **__${currShow}__** - *S0${foundShow.season}E0${
						foundShow.episode + 1
					}*\n`;
				} else {
					desc += `${i}. **__${currShow}__** - *S01E01*\n`;
				}
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
