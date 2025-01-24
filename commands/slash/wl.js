require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const clientManager = require("../../clientManager");
const { format, nextSaturday } = require("date-fns");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wl")
		.setDescription("Manage the watchlist")
		// add subcommand
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
		// remove subcommand
		.addSubcommand((subcommand) =>
			subcommand
				.setName("remove")
				.setDescription("Remove a show from the watchlist")
				.addStringOption((option) =>
					option
						.setName("show")
						.setDescription("Name of the show")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		// update subcommand
		.addSubcommand((subcommand) =>
			subcommand
				.setName("update")
				.setDescription("Update a show's details in the watchlist")
				.addStringOption((option) =>
					option
						.setName("show")
						.setDescription("Name of the show to update")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("season")
						.setDescription("New season number")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("episode")
						.setDescription("New episode number")
						.setRequired(true)
				)
		)
		// show subcommand
		.addSubcommand((subcommand) =>
			subcommand.setName("show").setDescription("View the current watchlist")
		),
	permissions: {
		add: ["admin", "moderator"],
		remove: ["admin", "moderator"],
		update: ["admin", "moderator"],
		show: [],
	},
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);

		// Handle autocomplete for the "show" option
		if (focusedOption.name === "show") {
			// Fetch the watchlist from the cache
			const watchlist = clientManager.getWatchlist();

			// Filter the cache based on user input
			const filtered = watchlist
				.map((item) => item.show_name)
				.filter((choice) =>
					choice.toLowerCase().includes(focusedOption.value.toLowerCase())
				);

			// Respond with filtered choices
			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice }))
			);
		}
	},
	async execute(interaction) {
		const subcommandHandlers = {
			// 'add' subcommand handler
			add: async () => {
				const showName = interaction.options.getString("show");
				const seasonNumber = interaction.options.getInteger("season") || 1;
				const episodeNumber = interaction.options.getInteger("episode") || 1;

				try {
					const newShow = await clientManager.addShowToWatchlist({
						show_name: showName,
						season_number: seasonNumber,
						episode_number: episodeNumber,
					});

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
			// 'remove' subcommand handler
			remove: async () => {
				const showName = interaction.options.getString("show");

				try {
					const removed = await clientManager.removeShowFromWatchlist(showName);
					if (removed) {
						await interaction.reply({
							content: `"${showName}" has been removed from the watchlist.`,
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: `"${showName}" was not found in the watchlist.`,
							ephemeral: true,
						});
					}
				} catch (error) {
					console.error("Error removing show from watchlist:", error);
					await interaction.reply({
						content: "There was an error removing the show from the watchlist.",
						ephemeral: true,
					});
				}
			},
			// 'show' subcommand handler
			show: async () => {
				const watchlist = clientManager.getWatchlist();

				// DATE
				const today = new Date();
				const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
				const watchDay = dayOfWeek === 6 ? today : nextSaturday(new Date());
				const formattedDate = format(watchDay, "MMM dd");

				// OUTPUT
				let responseText = `${formattedDate} Watchlist:\n`;
				watchlist.forEach((item) => {
					responseText += `- ${item.show_name}: S${item.season_number}E${item.episode_number}\n`;
				});

				await interaction.reply({ content: responseText, ephemeral: true });
			},
			update: async () => {
				// Retrieve options from the interaction
				const show_name = interaction.options.getString("show");
				const season_number = interaction.options.getInteger("season");
				const episode_number = interaction.options.getInteger("episode");

				// Proceed with updating the show in the watchlist
				try {
					// Check if show exists in the cached watchlist
					const show = clientManager
						.getWatchlist()
						.find((item) => item.show_name === show_name);

					if (!show) {
						// If the show doesn't exist
						await interaction.reply({
							content: `The show "${show_name}" does not exist in the watchlist.`,
							ephemeral: true,
						});
						return;
					}

					// Update the show in the database and cache
					const updateResult = await clientManager.updateShowInWatchlist(
						show_name,
						{ season_number, episode_number }
					);

					if (updateResult.success) {
						// Successfully updated
						const updatedShow = clientManager
							.getWatchlist()
							.find((item) => item.show_name === show_name);
						await interaction.reply({
							content: `Successfully updated "${show_name}" to Season ${updatedShow.season_number}, Episode ${updatedShow.episode_number}.`,
							ephemeral: true,
						});
					} else {
						// If update failed
						await interaction.reply({
							content: `Failed to update the show "${show_name}". Please check if the details are correct.`,
							ephemeral: true,
						});
					}
				} catch (error) {
					console.error("Error updating show:", error);
					await interaction.reply({
						content:
							"An error occurred while updating the watchlist. Please try again later.",
						ephemeral: true,
					});
				}
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
