const clientManager = require("../clientManager");
const client = clientManager.getClient();
const { Events } = require("discord.js");

module.exports = {
	name: Events.VoiceStateUpdate,
	execute(oldState, newState) {
		// Check to see if logging is active for channel
		const guildId = newState.guild.id;
		const channelId = newState.channelId || oldState.channelId;
		const loggingStates = client.loggingStates;

		if (
			!loggingStates.has(guildId) ||
			!loggingStates.get(guildId).has(channelId)
		) {
			return;
		}

		const channelStates = client.loggingStates.get(guildId);
		if (!channelStates.get(channelId)) {
			return;
		}

		const user = newState.member.user.tag;
		const channel = newState.channel
			? newState.channel.name
			: oldState.channel.name;
		const timestamp = new Date().toLocaleString();

		if (!oldState.channel && newState.channel) {
			console.log(`${timestamp}: ${user} joined ${channel}.`);
		} else if (oldState.channel && !newState.channel) {
			console.log(`${timestamp}: ${user} left ${channel}.`);
		}
	},
};
