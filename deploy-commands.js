const config = require("./config/config.js");
const { REST, Routes } = require("discord.js");
const clientId = config.bot.clientId;
const guildId = config.bot.guildId;
const token = config.bot.token;
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			// Guild specific commands update
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
			//Reset Guild specific commands
			// Routes.applicationGuildCommands(clientId, guildId),
			// { body: [] }

			// Global commands update
			// Routes.applicationCommands(clientId),
			// { body: commands }
			// Reset Global commands
			// Routes.applicationCommands(clientId),
			// { body: [] }
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
