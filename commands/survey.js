const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('survey')
		.setDescription('Starts a survey!'),
	async execute(interaction) {
		const survey = [];

		const filter = m => {return interaction.user.id === m.author.id};
		const options = {
			max: 1, time: 30000, errors: ['time']
		}

		interaction.reply('Welcome to the !survey command. First what is your name?', { fetchReply: true })
			.then(() => {
				interaction.channel.awaitMessages({ filter })
					.then(collected => {
						survey.name = `${collected.first().content}`
						console.log(survey)
						interaction.followUp(`You've entered: ${collected.first().content}`);
					})
					.catch(collected => {
						interaction.followUp(`Looks like you didn't respond in time.`);
					});
			});
		


	}
}

/*
.then(() => {
		interaction.channel.awaitMessages({filter,  max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				survey.name = `${m.content}`
				interaction.followUp(`You've entered:`, survey.name)
			});
	})
interaction.followUp(`What is your favorite candy?`)
	.then(() => {
		interaction.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				survey.answer = `${m.content}`
			})
		interaction.followUp(`You've entered:`, survey.answer)
	});



interaction.followUp(`Why is `, survey.answer, ` your favorite candy?`)
	.then(() => {
		interaction.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				survey.reason = `${m.content}`
			})

	})
console.log(survey)


}
} */