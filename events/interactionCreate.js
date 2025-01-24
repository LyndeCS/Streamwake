const { Events } = require("discord.js");
const clientManager = require("../clientManager");
const client = clientManager.getClient();
const config = require("../config");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		// PERMISSIONS
		const subcommand = interaction.options.getSubcommand(false);

		// Retrieve required roles from the command file
		const requiredRoles = command.permissions?.[subcommand] || [];
		const userId = interaction.user.id;

		// Role-based permissions check
		if (
			requiredRoles.includes("admin") &&
			!config.bot.adminArray.includes(userId)
		) {
			// Handle permission failure for all interaction types
			if (interaction.isAutocomplete()) {
				await interaction.respond([]);
			} else {
				await interaction.reply({
					content: "You need admin permissions to use this command.",
					ephemeral: true,
				});
			}
			return;
		}

		if (
			requiredRoles.includes("moderator") &&
			!config.bot.adminArray.includes(userId) &&
			!config.bot.moderatorArray.includes(userId)
		) {
			// Handle permission failure for all interaction types
			if (interaction.isAutocomplete()) {
				await interaction.respond([]);
			} else {
				await interaction.reply({
					content: "You need moderator permissions to use this command.",
					ephemeral: true,
				});
			}
			return;
		}

		// COMMAND EXECUTION

		if (interaction.isAutocomplete()) {
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.isChatInputCommand()) {
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				}
			}
		} else if (interaction.isButton()) {
			// Button is pressed
			if (
				interaction.customId !== "confirm" &&
				interaction.customId !== "cancel"
			) {
				await client.commands.get(interaction.customId).execute(interaction);
			}
		} else if (interaction.isStringSelectMenu()) {
			// Menu option is selected
			if (interaction.customId === "selectRecentShow") {
				await client.commands.get("selectrecentshow").execute(interaction);
			} else if (interaction.customId === "selectSuggestedShow") {
				await client.commands.get("selectsuggestedshow").execute(interaction);
			}
		}
	},
};
