require("dotenv").config();
const clientManager = require("../../clientManager");
const client = clientManager.getClient();
const { SlashCommandBuilder } = require("discord.js");
const bl = require("../../temp_models");
const { format, nextSaturday } = require("date-fns");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bl")
		.setDescription("View watchlist."),
	async execute(interaction) {},
};
