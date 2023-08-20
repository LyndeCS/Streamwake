require("dotenv").config();
const fs = require("fs");
const path = require("path");
const ownerId = process.env.OWNER_ID;
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stoplog")
		.setDescription("Stop logging user presence."),
	async execute(interaction) {
		// User is not owner of bot
		if (interaction.user.id !== ownerId) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		// User not in voice channel
		if (!interaction.member.voice.channelId) {
			await interaction.reply({
				content: "You are not in a voice channel.",
				ephemeral: true,
			});
			return;
		}

		const guildId = interaction.guildId;
		const guildName = interaction.guild.name;
		const channelId = interaction.member.voice.channelId;
		const channelName = interaction.member.voice.channel.name;

		// Logging not active in guild
		if (!interaction.client.loggingStates.has(guildId)) {
			await interaction.reply({
				content: "Logging is not active in this guild.",
				ephemeral: true,
			});
			return;
		}

		const channelStates = interaction.client.loggingStates.get(guildId);

		if (!channelStates.has(channelId)) {
			await interaction.reply({
				content: `Logging is currently inactive in ${channelName}.`,
				ephemeral: true,
			});
		} else {
			channelStates.set(channelId, false);

			// Log to a file
			const logMessage = `${new Date().toLocaleString()}: Logging stopped in ${channelName}.\n`;
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

			await interaction.reply({
				content: `Logging stopped in ${channelName}.`,
				ephemeral: true,
			});
		}
	},
};
