require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const admins = process.env.ADMIN_ARRAY;
const {
	SlashCommandBuilder,
	ChannelType,
	MessageFlags,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("delbotmsg")
		.setDescription("Delete all bot messages in selected channel")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Delete all bot messages in this channel")
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		),
	async execute(interaction) {
		if (!admins.includes(interaction.user.id)) {
			await interaction.reply({
				content: "You don't have permission to use this command.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		// Define the channel where you want to delete messages
		const channel = interaction.options.getChannel("channel");

		// Fetch messages in the channel
		const messages = await channel.messages.fetch();

		// Delete messages that are not sent by your bot
		const messagesToDelete = messages.filter(
			(message) => message.author.id == client.user.id
		);

		await channel.bulkDelete(messagesToDelete);

		// Optionally, you can send a message to indicate that the operation is complete
		const reply = await interaction.reply({
			content: `Deleted ${messagesToDelete.size} messages.`,
			flags: MessageFlags.Ephemeral,
		});
		reply.delete();
	},
};
