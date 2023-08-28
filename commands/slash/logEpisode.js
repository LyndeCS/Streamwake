require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const fs = require("fs");
const path = require("path");
const admins = process.env.ADMIN_ARRAY;
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("logep")
		.setDescription("Log episode start time."),
	async execute(interaction) {
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		const currShow = client.watchList[0];
		const guildName = interaction.guild.name;

		// Log to a file
		const logMessage = `${new Date().toLocaleString()}: ${
			currShow.showName
		} - S0${currShow.season}E0${currShow.episode}.\n`;
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
