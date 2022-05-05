const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('survey')
		.setDescription('Starts a survey!'),
	async execute(interaction) {
		await interaction.reply('Survey!');
	},
};