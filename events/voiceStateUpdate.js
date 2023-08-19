const { Events } = require("discord.js");

module.exports = {
	name: Events.VoiceStateUpdate,
	execute(oldState, newState) {
		const user = newState.member.user.tag;
		const channel = newState.channel
			? newState.channel.name
			: "a voice channel";

		if (!oldState.channel && newState.channel) {
			console.log(`${user} joined ${channel}.`);
		} else if (oldState.channel && !newState.channel) {
			console.log(`${user} left ${channel}.`);
		}
	},
};
