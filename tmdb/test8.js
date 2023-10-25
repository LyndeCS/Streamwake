const fs = require("fs");
const parse = require("csv-parser");
const { Op } = require("sequelize");

const { User, Episode, UserEpisode, Show, Season } = require("../models");

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

			if (username === "Website") continue;

			// Extract the season and episode numbers from the column name
			if (!row[column]) continue;
			let seasonNumber = Number(row[column].slice(1, 3));
			let episodeNumber = Number(row[column].slice(4, 6));

			if (column === "Jujutsu Kaisen") {
				seasonNumber = 1;
				episodeNumber += 24;
			}

			// Get the show title from the header (column name)
			const showTitle = column;

			// Find the user and episode based on the username, show title, season, and episode numbers
			for (let i = 1; i <= episodeNumber; i++) {
				User.findOne({ where: { username } })
					.then((user) => {
						if (!user) {
							console.error(`User not found for username: ${username}`);
							return;
						}

						Episode.findOne({
							where: { number: i },
							include: [
								{
									model: Season,
									where: { number: seasonNumber },
									include: [
										{
											model: Show,
											where: { title: showTitle },
										},
									],
								},
							],
						})
							.then((episode) => {
								if (!episode) {
									console.error(
										`Episode not found for title: ${showTitle}, season: ${seasonNumber}, episode: ${i}`
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
						console.error("Error finding user:", username, error);
					});
			}
		}
	})
	.on("end", () => {
		// Bulk insert UserEpisode records

		setTimeout(() => {
			UserEpisode.bulkCreate(userEpisodes)
				.then(() => {
					console.log("UserEpisode records created successfully.");
				})
				.catch((error) => {
					console.error("Error creating UserEpisode records:", error);
				});
			console.log(userEpisodes);
		}, 7000);
	});
