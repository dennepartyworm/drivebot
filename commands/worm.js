const { SlashCommandBuilder } = require('discord.js');
const { authorId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('worm')
		.setDescription('Replies with Worm!'),
	async execute(interaction) {
		if(interaction.user.id === authorId){
			await interaction.reply('🎷🐛');
		}
	}
}
