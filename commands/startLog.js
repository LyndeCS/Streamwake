require("dotenv").config();
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
		const channelId = interaction.member.voice.channelId;
		const channelName = interaction.member.voice.channel.name;

		if (!interaction.client.loggingStates.has(guildId)) {
			interaction.client.loggingStates.set(guildId, new Collection());
		}

		const channelStates = interaction.client.loggingStates.get(guildId);

		if (!channelStates.has(channelId)) {
			channelStates.set(channelId, true);
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
