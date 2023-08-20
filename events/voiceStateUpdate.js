const clientManager = require("../clientManager");
const client = clientManager.getClient();
const fs = require("fs");
const path = require("path");
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
		const guildName = newState.guild.name;

		if (!oldState.channel && newState.channel) {
			console.log(`${timestamp}: ${user} joined ${channel}.`);

			// Log to a file
			const logMessage = `${timestamp}: ${user} joined ${channel}.\n`;
			const logFilePath = path.join(
				__dirname,
				"..",
				"logs",
				`${guildName}.log`
			);

			// Create the "logs" directory if it doesn't exist
			const logsDirectory = path.join(__dirname, "..", "logs");
			if (!fs.existsSync(logsDirectory)) {
				fs.mkdirSync(logsDirectory);
			}

			// Append log message to the log file
			fs.appendFileSync(logFilePath, logMessage);
		} else if (oldState.channel && !newState.channel) {
			console.log(`${timestamp}: ${user} left ${channel}.`);

			// Log to a file
			const logMessage = `${timestamp}: ${user} left ${channel}.\n`;
			const logFilePath = path.join(
				__dirname,
				"..",
				"logs",
				`${guildName}.log`
			);

			// Create the "logs" directory if it doesn't exist
			const logsDirectory = path.join(__dirname, "..", "logs");
			if (!fs.existsSync(logsDirectory)) {
				fs.mkdirSync(logsDirectory);
			}

			// Append log message to the log file
			fs.appendFileSync(logFilePath, logMessage);
		}
	},
};
