require("dotenv").config();
const TMDB_KEY = process.env.TMDB_KEY;
const fetch = require("node-fetch");
const { sequelize, Show, Season, Episode } = require("./models");
const { Op } = require("sequelize");

// Function to fetch and store episode data for a season
async function fetchAndStoreEpisodes(seriesId, seasonNumber) {
	const apiUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${TMDB_KEY}`;

	try {
		// Make an API request to fetch episode data
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error("TMDB API request failed");
		}

		// Parse the API response
		const seasonData = await response.json();
		const episodes = seasonData.episodes;

		// Get the season ID from the database
		const season = await Season.findOne({
			where: {
				tmdb_id: seasonData.id,
			},
		});

		if (season) {
			// Store episode data in the database
			for (const episode of episodes) {
				await Episode.create({
					tmdb_id: episode.id,
					season_id: season.id,
					number: episode.episode_number,
					title: episode.name,
					air_date: episode.air_date,
					description: episode.overview,
					runtime: episode.runtime,
				});
			}

			console.log(`Fetched and stored episode data for season ${seasonNumber}`);
		} else {
			console.error(
				`Season not found in the database for TMDB season ID ${seasonData.id}`
			);
		}
	} catch (error) {
		console.error(
			`Error fetching or storing episodes for season ${seasonNumber}:`,
			error
		);
	}
}

// Function to fetch and store episodes for all seasons of a show
async function fetchAndStoreEpisodesForShow(
	showId,
	tmdbSeriesId,
	seasonNumbers
) {
	for (const seasonNumber of seasonNumbers) {
		await fetchAndStoreEpisodes(tmdbSeriesId, seasonNumber);
	}
}

// Fetch show and season data from the database
(async () => {
	const showsAndSeasons = await Show.findAll({
		include: Season,
		where: {
			"$Seasons.id$": { [Op.ne]: null },
		},
	});

	for (const show of showsAndSeasons) {
		const tmdbSeriesId = show.tmdb_id;
		const seasonNumbers = show.seasons.map((season) => season.number);
		await fetchAndStoreEpisodesForShow(show.id, tmdbSeriesId, seasonNumbers);
	}
})();
