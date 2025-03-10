require("dotenv").config();
const clientManager = require("../../../clientManager");
const client = clientManager.getClient();
const fs = require("fs");
const path = require("path");
const admins = process.env.ADMIN_ARRAY;
const { SlashCommandBuilder, Collection, MessageFlags } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("startlog")
		.setDescription("Start logging user presence."),
	async execute(interaction) {
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!interaction.member.voice.channelId) {
			await interaction.reply({
				content: "You are not in a voice channel.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const guildId = interaction.guildId;
		const guildName = interaction.guild.name;
		const channelId = interaction.member.voice.channelId;
		const channelName = interaction.member.voice.channel.name;

		if (!client.loggingStates.has(guildId)) {
			client.loggingStates.set(guildId, new Collection());
		}

		const channelStates = client.loggingStates.get(guildId);

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
					logMessage += `${member.user.tag} is present.\n`;
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
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: `Logging is already active in ${channelName}.`,
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
