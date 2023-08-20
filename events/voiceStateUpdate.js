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
		const newChannelId = newState.channel ? newState.channelId : null;
		const oldChannelId = oldState.channel ? oldState.channelId : null;
		const loggingStates = client.loggingStates;
		let userMoved = false;

		// Logging not active in guild
		if (!loggingStates.has(guildId)) {
			return;
		}

		const channelStates = client.loggingStates.get(guildId);

		// User switches channels
		if (newState.channel && oldState.channel) {
			if (newChannelId !== oldChannelId) {
				userMoved = true;
			}
			if (
				!channelStates.get(newChannelId) &&
				!channelStates.get(oldChannelId)
			) {
				return;
			}
		}

		const user = newState.member.user.tag;
		const channel = newState.channel
			? newState.channel.name
			: oldState.channel.name;
		const timestamp = new Date().toLocaleString();
		const guildName = newState.guild.name;

		// User CONNECTS TO CHANNEL
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

			// USER DISCONNECTS FROM CHANNEL
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
		} else if (userMoved) {
			// USER MOVED INTO CHANNEL FROM ANOTHER CHANNEL
			if (channelStates.get(newChannelId)) {
				console.log(`${timestamp}: ${user} moved into ${channel}.`);

				// Log to a file
				const logMessage = `${timestamp}: ${user} moved into ${channel}.\n`;
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
			} else if (channelStates.get(oldChannelId)) {
				// USER MOVED INTO CHANNEL FROM ANOTHER CHANNEL
				console.log(
					`${timestamp}: ${user} moved out of ${oldState.channel.name}.`
				);

				// Log to a file
				const logMessage = `${timestamp}: ${user} moved out of ${channel}.\n`;
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
		}
	},
};
