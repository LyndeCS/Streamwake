const Sequelize = require("sequelize");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");

class ClientManager {
	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildScheduledEvents,
			],
		});

		this.sequelize = new Sequelize(
			config.db.tempName,
			config.db.tempUser,
			config.db.tempPassword,
			{
				host: "localhost",
				dialect: "mysql",
			}
		);

		this.client.commands = new Collection();
		this.client.loggingStates = new Collection();
		this.client.watchList = [];
		this.client.suggestedShowsList = [];
		this.client.recentShowsList = [
			{
				showName: "Jujutsu Kaisen",
				season: 2,
				episode: 6,
				episodeName: "Premature Death",
				url: "https://www.crunchyroll.com/watch/GX9UQZEZJ/premature-death",
				thumbnail:
					"https://www.crunchyroll.com/imgsrv/display/thumbnail/1200x675/catalog/crunchyroll/c9f115153a07e900a045e63cc8e78fe1.jpe",
				desc: "August 2007. Gojo starts to handle missions on his own, causing Geto to, as well. One day a certain individual appears before Geto. What's the conclusion that led to Gojo becoming the strongest jujutsu sorcerer, and Geto becoming the most evil curse user?",
			},
			{
				showName: "Psycho-Pass",
				season: 1,
				episode: 10,
				episodeName: "Paradise Fruit",
				url: "https://www.crunchyroll.com/watch/G6WEXEWQ6/paradise-fruit",
				thumbnail:
					"https://m.media-amazon.com/images/M/MV5BMzQ1ODFkNzItZWJmMC00NmQyLTg4OTEtZWYxNmZhZmU0MWJmXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_FMjpg_UX1000_.jpg",
				desc: "After the incident with Rikako Ouryou, the MWPSB is now aware of Makishima’s existence, and they try to dig up more evidence on him. Meanwhile, Kogami takes Akane to see a professor who used to give lectures to the MWPSB investigators.",
			},
			{
				showName: "Reborn as a Vending Machine, I Now Wander the Dungeon",
				season: 1,
				episode: 7,
				episodeName: "The Flame Skeletitan of the Labyrinth Stratum",
				url: "https://www.crunchyroll.com/watch/G7PU4J7Q3/the-flame-skeletitan-of-the-labyrinth-stratum",
				thumbnail:
					"https://www.crunchyroll.com/imgsrv/display/thumbnail/1200x675/catalog/crunchyroll/4e6d92a8a40b7028011b9692c974aa65.jpe",
				desc: "Boxxo, Lammis, and a large formidable group go on a campaign in the Labyrinth stratum to defeat the local stratum lord. Meanwhile, Kerioyl reveals his reasons for targeting such foes in the first place.",
			},
			{
				showName: "The God of Highschool",
				season: 1,
				episode: 3,
				episodeName: "wisdom/kingdom",
				url: "https://www.crunchyroll.com/watch/GYZJNK74R/wisdomkingdom",
				thumbnail:
					"https://m.media-amazon.com/images/M/MV5BYjljYmYzNjMtZWY5YS00OGZjLTk4MTYtNDZmYzkxYjgyMDMzXkEyXkFqcGdeQXVyODM2NjQzOTA@._V1_.jpg",
				desc: "Mira faces off against WWD women's pro wrestler Mah Miseon, but her swordfighting can't keep up with Miseon's well-built body and overwhelming strength.",
			},
			{
				showName: "Hinamatsuri",
				season: 1,
				episode: 10,
				episodeName: "Life Is About Survival",
				url: "https://www.crunchyroll.com/watch/GREX51Z3Y/life-is-about-survival",
				thumbnail:
					"https://www.crunchyroll.com/imgsrv/display/thumbnail/1200x675/catalog/crunchyroll/6d2f1f6666708860afff5448626ff8da.jpe",
				desc: "Security chief Ikaruga summons Mao to Japan, who instead ends up stranded on a deserted island. Meanwhile, Nitta’s ailing president is searching for someone to replace him.",
			},
			{
				showName: "Eighty-Six",
				season: 1,
				episode: 6,
				episodeName: "I'm With You",
				url: "https://www.crunchyroll.com/watch/G4VUQMQ2P/im-with-you",
				thumbnail:
					"https://www.crunchyroll.com/imgsrv/display/thumbnail/1200x675/catalog/crunchyroll/aa3f7282fe345e81a1addada43bfad92.jpe",
				desc: "Lena learns the truth about the upcoming end of the war, and how the Legion is a much more deadly threat than she though.",
			},
			{
				showName: "Zom 100: Bucket List of the Dead",
				season: 1,
				episode: 4,
				episodeName: "Hero of the Dead",
				url: "https://www.netflix.com/watch/81680107?trackId=255824129",
				thumbnail: "https://flxt.tmsimg.com/assets/p24955247_b_h8_ab.jpg",
				desc: "Remembering his childhood dream, Akira goes into the aquarium to grab a certain item, only to run into a group of survivors running for their lives.",
			},
			{
				showName: "Mob Psycho 100",
				season: 1,
				episode: 1,
				episodeName: "Doubts About Youth ~The Telepathy Club Appears~",
				url: "https://www.funimation.com/v/mob-psycho-100/doubts-about-youth-the-telepathy-club-appears",
				thumbnail:
					"https://m.media-amazon.com/images/M/MV5BYWIwZjhkMzgtOWExYi00ZGIwLTg1ZTktNjQyZWIxYWFmZTc0XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
				desc: "The Telepathy Club is told the student council will shut them down due to a lack of members. Then, one of the members, Inukawa, thought of possibly getting Mob to join. However, Mob gets a call from Reigen about taking care of an incident at Highso Girls' Academy...",
			},
			{
				showName: "Death Parade",
				season: 1,
				episode: 7,
				episodeName: "Death Rally",
				url: "https://www.funimation.com/v/death-parade/death-rally",
				thumbnail:
					"https://i.etsystatic.com/18154652/r/il/d4c62f/1772032399/il_fullxfull.1772032399_gkzb.jpg",
				desc: "As per Nona's arrangements, Decim is sent two new guests; a young man named Shimada and a detective named Tatsumi, one of whom is allegedly a murderer. While searching for a way out, Shimada finds a blood-stained knife among his belongings, unsure of where it came from.",
			},
			{
				showName: "Link Click",
				season: 2,
				episode: 2,
				episodeName: "Consequence of Goodwill",
				url: "https://www.crunchyroll.com/watch/GZ7UVKGMW/consequence-of-goodwill",
				thumbnail:
					"https://www.crunchyroll.com/imgsrv/display/thumbnail/1200x675/catalog/crunchyroll/e267dad3c1f27dc070f3ae2f1dc76da7.jpe",
				desc: "Xu Shanshan's disappearance was not simple. At the same time, Lu Guang discovered unexpected clues from the photos.",
			},
			{
				showName: "My Unique Skill Makes Me OP Even at Level 1",
				season: 1,
				episode: 1,
				episodeName: "Dead or Carrot",
				url: "https://aniwave.to/watch/level-1-dakedo-unique-skill-de-saikyou-desu.w1oxo/ep-2",
				thumbnail:
					"https://www.crunchyroll.com/imgsrv/display/thumbnail/1200x675/catalog/crunchyroll/34961bcd3a3eec5e57f2f811799881ed.jpe",
				desc: "After hitting Ryota in the head, a normally fatal blow known as Excalibur, bunny-girl demands to know how he survived. Not wanting to disclose Nihonium has given him S-level health, Ryota distracts her with S-quality carrots.",
			},
			{
				showName: "ID: Invaded",
				season: 1,
				episode: 7,
				episodeName: "Desertified",
				url: "https://www.funimation.com/v/id-invaded/desertified",
				thumbnail:
					"https://www.theouterhaven.net/wp-content/uploads/2020/03/0_jeDlDXgcExve1-5g.jpg",
				desc: "While Momoki is interrogated by the police, Togo leads a rescue mission to extract Hondomachi from Kiki Asukai's id well.",
			},
			{
				showName: "Erased",
				season: 1,
				episode: 1,
				episodeName: "Palm of the Hand",
				url: "https://www.netflix.com/watch/80114227?trackId=255824129",
				thumbnail: "https://flxt.tmsimg.com/assets/p14332232_b_h10_ae.jpg",
				desc: "After Satoru discovers his mother murdered in his apartment, he goes back 18 years in time, before classmate Kayo's kidnapping and murder.",
			},
			{
				showName: "Great Pretender",
				season: 1,
				episode: 1,
				episodeName: "Case 1_2: Los Angeles Connection",
				url: "https://www.netflix.com/watch/81220466?trackId=255824129",
				thumbnail:
					"https://butwhytho.net/wp-content/uploads/2020/12/The-Great-Pretender-Season-2-But-Why-Tho.jpg",
				desc: "Dangling from the Hollywood sign, Makoto recalls his path from salesman to criminal; back on the ground, he learns more about 'confidence men.'",
			},
		];
		this.client.recentShowsDropdownList = [...this.client.recentShowsList];
		this.client.embeds = new Collection();
		this.client.appStates = new Collection().set({ wl: false, player: false });
	}

	async login(token) {
		await this.client.login(token);
	}

	getClient() {
		return this.client;
	}

	loadCommands() {
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
				// Set a new item in the Collection with the key as the command name and the value as the exported module
				if ("data" in command && "execute" in command) {
					this.client.commands.set(command.data.name, command);
				} else {
					console.log(
						`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
					);
				}
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
