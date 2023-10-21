const fs = require("fs");
const parse = require("csv-parser");
const { Op } = require("sequelize");

// Load your sequelize models and define the associations
const { User, Episode, UserEpisode, Show, Season } = require("./models"); // Update with the actual models

// Define the path to your CSV file
const csvFilePath = "C:/discord_bot_projects/Streamwake/tmdb/animaturday.csv";

// Read the CSV file and create UserEpisode records
const userEpisodes = [];

fs.createReadStream(csvFilePath)
	.pipe(parse())
	.on("data", (row) => {
		const username = row.Username;

		// Iterate through the columns that represent episodes
		for (const column in row) {
			if (column === "Name" || column === "Username") {
				continue; // Skip non-episode columns
			}

			// Extract the season and episode numbers from the column name
			const matchResult = column.match(/s(\d+)e(\d+)/);

			if (matchResult) {
				const [seasonNumber, episodeNumber] = matchResult.slice(1, 3);
				// Now you can use seasonNumber and episodeNumber here
			} else {
				// Handle the case where there is no match
				console.error(`No match found in column: ${column}`);
			}

			// Get the show title from the header (column name)
			const showTitle = column;

			// Find the user and episode based on the username, show title, season, and episode numbers
			User.findOne({ where: { username } })
				.then((user) => {
					if (!user) {
						console.error(`User not found for username: ${username}`);
						return;
					}

					Episode.findOne({
						where: { number: episodeNumber },
						include: [
							{
								model: Season,
								where: { number: seasonNumber },
								include: [
									{
										mode: Show,
										where: { title: showTitle },
									},
								],
							},
						],
					})
						.then((episode) => {
							if (!episode) {
								console.error(
									`Episode not found for title: ${showTitle}, season: ${seasonNumber}, episode: ${episodeNumber}`
								);
								return;
							}

							// Create a UserEpisode record
							userEpisodes.push({ user_id: user.id, episode_id: episode.id });
						})
						.catch((error) => {
							console.error("Error finding episode:", error);
						});
				})
				.catch((error) => {
					console.error("Error finding user:", error);
				});
		}
	})
	.on("end", () => {
		// Bulk insert UserEpisode records
		// UserEpisode.bulkCreate(userEpisodes)
		// 	.then(() => {
		// 		console.log("UserEpisode records created successfully.");
		// 	})
		// 	.catch((error) => {
		// 		console.error("Error creating UserEpisode records:", error);
		// 	});

		console.log(userEpisodes[0]);
	});
