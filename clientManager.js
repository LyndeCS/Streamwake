require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

class ClientManager {
	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildVoiceStates,
			],
		});

		this.client.commands = new Collection();
		this.client.loggingStates = new Collection();

		this.loadCommands();
	}

	async login(token) {
		await this.client.login(token);
	}

	getClient() {
		return this.client;
	}

	loadCommands() {
		const commandsPath = path.join(__dirname, "commands");
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ("data" in command && "execute" in command) {
				this.client.commands.set(command.data.name, command);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
				);
			}
		}
	}

	loadEvents() {
		const eventsPath = path.join(__dirname, "events");
		const eventFiles = fs
			.readdirSync(eventsPath)
			.filter((file) => file.endsWith(".js"));

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			if (event.once) {
				this.client.once(event.name, (...args) =>
					event.execute(...args, this.client)
				);
			} else {
				this.client.on(event.name, (...args) =>
					event.execute(...args, this.client)
				);
			}
		}
	}
}

module.exports = new ClientManager();
