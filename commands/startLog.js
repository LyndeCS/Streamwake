require("dotenv").config();
const fs = require("fs");
const path = require("path");
const ownerId = process.env.OWNER_ID;
const { SlashCommandBuilder, Collection } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("startlog")
		.setDescription("Start logging user presence."),
	async execute(interaction) {
		if (interaction.user.id !== ownerId) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

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

		if (!interaction.client.loggingStates.has(guildId)) {
			interaction.client.loggingStates.set(guildId, new Collection());
		}

		const channelStates = interaction.client.loggingStates.get(guildId);

		if (!channelStates.has(channelId)) {
			channelStates.set(channelId, true);

			// Log to a file
			let logMessage = `${new Date().toLocaleString()}: Logging started in ${channelName}.\n`;
			const logFilePath = path.join(
				__dirname,
				"..",
				"logs",
				`${guildName}.log`
			);

			// Get the voice channel
			const voiceChannel = interaction.member.voice.channel;
			if (voiceChannel) {
				const voiceMembers = voiceChannel.members;

				// Log current users in the voice channel
				voiceMembers.forEach((member) => {
					logMessage += `${member.user.tag} is in the channel.\n`;
				});
			}

			// Create the "logs" directory if it doesn't exist
			const logsDirectory = path.join(__dirname, "..", "logs");
			if (!fs.existsSync(logsDirectory)) {
				fs.mkdirSync(logsDirectory);
			}

			// Append log message to the log file
			fs.appendFileSync(logFilePath, logMessage);

			await interaction.reply({
				content: `Logging started in ${channelName}.`,
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: `Logging is already active in ${channelName}.`,
				ephemeral: true,
			});
		}
	},
};
