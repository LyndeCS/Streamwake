require("dotenv").config();
const fs = require("fs");
const path = require("path");
const ownerId = process.env.OWNER_ID;
const adminId = process.env.ADMIN_ID;
const admins = [ownerId, adminId];
const { SlashCommandBuilder, Collection } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("logep")
		.setDescription("Log episode start time.")
		.addStringOption((option) =>
			option.setName("show").setDescription("Name of show").setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("episode")
				.setDescription("episode: s00e00")
				.setRequired(true)
		),
	async execute(interaction) {
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		const show = interaction.options.getString("show");
		const episode = interaction.options.getString("episode");
		const guildName = interaction.guild.name;

		// Log to a file
		const logMessage = `${new Date().toLocaleString()}: ${show} ${episode}.\n`;
		const logFilePath = path.join(
			__dirname,
			"..",
			"logs",
			`${guildName}-episodes.log`
		);

		// Create the "logs" directory if it doesn't exist
		const logsDirectory = path.join(__dirname, "..", "logs");
		if (!fs.existsSync(logsDirectory)) {
			fs.mkdirSync(logsDirectory);
		}

		// Append log message to the log file
		fs.appendFileSync(logFilePath, logMessage);

		await interaction.reply({
			content: `Logged: ${new Date().toLocaleString()}: ${show} ${episode}.\n`,
			ephemeral: true,
		});
	},
};
