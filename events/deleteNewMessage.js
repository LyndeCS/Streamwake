const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { Events } = require("discord.js");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// if (message.channel.id === "1145205774985990144") {
		// 	if (message.author.id !== client.user.id) {
		// 		await message.delete();
		// 	}
		// }
	},
};
