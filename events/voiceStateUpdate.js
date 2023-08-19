const { Events } = require("discord.js");

module.exports = {
	name: Events.VoiceStateUpdate,
	execute(oldState, newState) {
		const user = newState.member.user.tag;
		const channel = newState.channel
			? newState.channel.name
			: oldState.channel.name;
		const timestamp = new Date().toLocaleString();
		// const guildId = newState.guild.id;
		// const channelId = newState.channelId || oldState.channelId;

		if (!oldState.channel && newState.channel) {
			console.log(`${timestamp}: ${user} joined ${channel}.`);
		} else if (oldState.channel && !newState.channel) {
			console.log(`${timestamp}: ${user} left ${channel}.`);
		}
	},
};
