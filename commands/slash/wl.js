require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const clientManager = require("../../clientManager");
const { format, nextSaturday } = require("date-fns");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wl")
		.setDescription("Manage the watchlist")
		// ADD
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
				.addIntegerOption((option) =>
					option
						.setName("position")
						.setDescription("Position in the watchlist")
						.setRequired(false)
						.setMinValue(1)
				)
		)
		// REMOVE
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
		// UPDATE
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
						.setRequired(false)
				)
				.addIntegerOption((option) =>
					option
						.setName("episode")
						.setDescription("New episode number")
						.setRequired(false)
				)
				.addIntegerOption((option) =>
					option
						.setName("position")
						.setDescription("Position in the watchlist")
						.setRequired(false)
						.setMinValue(1)
				)
		)
		// SHOW
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
			// ADD
			add: async () => {
				const showName = interaction.options.getString("show");
				const seasonNumber = interaction.options.getInteger("season") || 1;
				const episodeNumber = interaction.options.getInteger("episode") || 1;
				const watchlist = clientManager.getWatchlist();
				const MAX_POSITION = watchlist.length + 1;
				const position =
					Math.min(interaction.options.getInteger("position"), MAX_POSITION) ||
					MAX_POSITION;

				try {
					const newShow = await clientManager.addShowToWatchlist({
						show_name: showName,
						season_number: seasonNumber,
						episode_number: episodeNumber,
						position: position,
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
			// REMOVE
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
			// SHOW
			show: async () => {
				const sortedWatchlist = clientManager
					.getWatchlist()
					.sort((a, b) => (a.position > b.position ? 1 : -1));

				// CODE BLOCK FORMATTING
				const maxShowTitleLength = Math.max(
					...sortedWatchlist.map((item) => item.show_name.length)
				);
				// const maxEpisodeTitleLength = Math.max(
				// 	...sortedWatchlist.map((item) => item.episodeTitle.length)
				// );

				let output = "```\n"; // Start code block
				output += `#  | ${"Show Title".padEnd(maxShowTitleLength)} | S | E\n`;
				//| ${"Episode Title".padEnd(maxEpisodeTitleLength)}
				output += `---+${"-".repeat(maxShowTitleLength + 2)}+---+---\n`;
				//|${"-".repeat(maxEpisodeTitleLength + 2)}

				for (const item of sortedWatchlist) {
					output += `${item.position}. | ${item.show_name.padEnd(
						maxShowTitleLength
					)} | ${item.season_number} | ${item.episode_number}\n`;
					// | ${item.episodeTitle.padEnd(maxEpisodeTitleLength)}
				}

				output += "```";

				// DATE
				const today = new Date();
				const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
				const watchDay = dayOfWeek === 6 ? today : nextSaturday(new Date());
				const formattedDate = format(watchDay, "MMM dd");

				// OUTPUT
				let responseText = `${formattedDate} Watchlist:\n`;
				sortedWatchlist.forEach((item) => {
					responseText += `${item.position}. ${item.show_name}: s${item.season_number} e${item.episode_number}\n`;
				});

				await interaction.reply({ content: output, ephemeral: true });
			},
			// UPDATE
			update: async () => {
				// Retrieve options from the interaction
				const showName = interaction.options.getString("show");
				const seasonNumber = interaction.options.getInteger("season");
				const episodeNumber = interaction.options.getInteger("episode");
				const newPosition = interaction.options.getInteger("position");
				const watchlist = clientManager.getWatchlist();
				const MAX_POSITION = watchlist.length;

				// Proceed with updating the show in the watchlist
				try {
					// Check if show exists in the cached watchlist
					const show = watchlist.find((item) => item.show_name === showName);

					if (!show) {
						// If the show doesn't exist
						await interaction.reply({
							content: `The show "${showName}" does not exist in the watchlist.`,
							ephemeral: true,
						});
						return;
					}

					// Update the show in the database and cache
					const updateResult = await clientManager.updateShowInWatchlist(
						showName,
						{
							show_name: showName || show.show_name,
							season_number: seasonNumber || show.season_number,
							episode_number: episodeNumber || show.episode_number,
							position: newPosition
								? Math.min(Math.max(newPosition, 1), MAX_POSITION)
								: show.position,
						}
					);

					if (updateResult) {
						// Successfully updated
						const updatedShow = watchlist.find(
							(item) => item.show_name === showName
						);
						await interaction.reply({
							content: `Successfully updated "${showName}".`,
							ephemeral: true,
						});
					} else {
						// If update failed
						await interaction.reply({
							content: `Failed to update the show "${showName}". Please check if the details are correct.`,
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
