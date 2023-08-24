require("dotenv").config();
const ownerId = process.env.OWNER_ID;
const {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wl")
		.setDescription("Open watchlist UI."),
	async execute(interaction) {
		if (interaction.user.id !== ownerId) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
			return;
		}

		// Build Embed
		const watchList = new EmbedBuilder()
			.setColor(0x00be92)
			.setAuthor({
				name: "ANIMATURDAY",
			})
			.setTitle("Watch List")
			.setThumbnail("https://i.imgur.com/U63bswA.png");
		// .setDescription(`*"Episode description."*`);
		//.addFields({ name: "\u200b", value: "\u200b" });

		// Build Buttons
		const addButton = new ButtonBuilder()
			.setCustomId("addshow")
			.setStyle(ButtonStyle.Success)
			.setEmoji("➕");

		// Build Action Row
		const buttonRow = new ActionRowBuilder().addComponents(addButton);

		const reply = await interaction.reply("Starting binger.");
		await reply.delete();
		await interaction.channel.send({
			embeds: [watchList],
			components: [buttonRow],
		});
	},
};
