require("dotenv").config();
const ownerId = process.env.OWNER_ID;
const { SlashCommandBuilder, Collection } = require("discord.js");

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
			await interaction.reply({
				content: `Logging stopped in ${channelName}.`,
				ephemeral: true,
			});
		}
	},
};
