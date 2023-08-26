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
		this.client.watchList = [];
		this.client.suggestedShowsList = [];
		this.client.recentShowsList = [
			{ showName: "Jujutsu Kaisen", season: 2, episode: 5 },
			{ showName: "Psycho-Pass", season: 1, episode: 8 },
			{
				showName: "Reborn as a Vending Machine, I Now Wander the Dungeon",
				season: 1,
				episode: 7,
			},
			{ showName: "God of Highschool", season: 1, episode: 2 },
			{ showName: "Hinamatsuri", season: 1, episode: 8 },
			{ showName: "Eighty-Six", season: 1, episode: 4 },
			{ showName: "Zom 100: Bucket List of the Dead", season: 1, episode: 4 },
			{ showName: "Mob Psycho 100", season: 1, episode: 1 },
			{ showName: "Death Parade", season: 1, episode: 7 },
			{ showName: "Link Click", season: 1, episode: 8 },
			{
				showName: "My Unique Skill Makes Me OP Even at Level 1",
				season: 1,
				episode: 1,
			},
			{ showName: "ID: Invaded", season: 1, episode: 7 },
			{ showName: "Erased", season: 1, episode: 1 },
			{ showName: "Great Pretender", season: 1, episode: 1 },
		];
		this.client.embeds = new Collection();
		this.client.appStates = new Collection().set("wl", false);
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
