require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const wl = require("../../temp_models");
const { format, nextSaturday } = require("date-fns");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wl2")
		.setDescription("Manage the watchlist")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Add a show to the watchlist")
				.addStringOption((option) =>
					option
						.setName("show")
						.setDescription("Name of the show")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("season")
						.setDescription("Season number")
						.setRequired(false)
				)
				.addIntegerOption((option) =>
					option
						.setName("episode")
						.setDescription("Episode number")
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove a show from the watchlist")
				.addStringOption((option) =>
					option
						.setName("show")
						.setDescription("Name of the show")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("show").setDescription("View the current watchlist")
		),
	async execute(interaction) {
		const subcommandHandlers = {
			add: async () => {
				const showName = interaction.options.getString("show");
				const seasonNumber = interaction.options.getInteger("season") || 1;
				const episodeNumber = interaction.options.getInteger("episode") || 1;

				try {
					// Add a new show to the watchlist
					const newShow = await wl.create({
						show_name: showName,
						season_number: seasonNumber, // Default season number; you can make this dynamic if needed
						episode_number: episodeNumber, // Default episode number; you can make this dynamic if needed
						episode_name: null, // Default to null if not specified
					});

					// Respond to the user
					await interaction.reply({
						content: `"${newShow.show_name}" has been added to the watchlist.`,
						ephemeral: true,
					});
				} catch (error) {
					console.error("Error adding show to watchlist:", error);
					await interaction.reply({
						content: "There was an error adding the show to the watchlist.",
						ephemeral: true,
					});
				}
			},

			remove: async () => {
				const show = interaction.options.getString("show");
				// Logic to remove the show
				await interaction.reply(
					`Show "${show}" has been removed from the watchlist.`
				);
			},
			show: async () => {
				// Logic to fetch and display the watchlist

				// DATE
				const today = new Date();
				const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
				const watchDay = dayOfWeek === 6 ? today : nextSaturday(new Date());
				const formattedDate = format(watchDay, "MMM dd");

				// FETCH
				const watchlistItems = await wl.findAll();

				// OUTPUT
				let responseText = `${formattedDate} Watchlist:\n`;
				watchlistItems.forEach((item) => {
					responseText += `- ${item.show_name}: S${item.season_number}E${item.episode_number}\n`;
				});

				await interaction.reply({ content: responseText, ephemeral: true });
			},
		};

		// Get the subcommand and execute the corresponding handler
		const subcommand = interaction.options.getSubcommand();
		const handler = subcommandHandlers[subcommand];

		if (handler) {
			await handler();
		} else {
			await interaction.reply({
				content: "Unknown subcommand!",
				ephemeral: true,
			});
		}
	},
};
