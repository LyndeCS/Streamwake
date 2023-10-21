const fs = require("fs");
const csv = require("csv-parser");

const users = {};

fs.createReadStream("C:/discord_bot_projects/Streamwake/tmdb/animaturday.csv")
	.pipe(csv())
	.on("data", (row) => {
		const name = row.Name;
		const username = row.Username;
		users[username] = {
			Name: name,
			Username: username,
			Shows: {},
		};

		for (const header in row) {
			if (header !== "Name" && header !== "Username") {
				const show = header;
				const episode = row[header].trim();

				if (episode) {
					users[username].Shows[show] = users[username].Shows[show] || [];
					users[username].Shows[show].push(episode);
				}
			}
		}
	})
	.on("end", () => {
		// Organize and display the data
		for (const username in users) {
			if (username !== "Website") {
				const user = users[username];
				console.log(`User: ${user.Name} (${user.Username})`);
				for (const show in user.Shows) {
					const episodes = user.Shows[show];
					console.log(`- ${show}: ${episodes.join(", ")}`);
				}
				console.log();
			}
		}
	});
