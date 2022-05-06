const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('survey')
		.setDescription('Starts a survey!'),
	async execute(interaction) {
		const survey = [];

		const filter = m => {return interaction.user.id === m.author.id};

		interaction.reply('Welcome to the !survey command. First what is your name?', { fetchReply: true })
			.then(() => {
				interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
					.then(collected => {
						survey.name = `${collected.first().content}`
						console.log(survey)
						interaction.followUp(`What is your favorite candy?`)
						.then(() => {
								interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
									.then(collected => {
										survey.candy = `${collected.first().content}`
										console.log(survey)
										interaction.followUp(`I'm not sure I like that candy... Why do you enjoy it so?`)
											.then(() => {
												interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
													.then(collected => {
														survey.reason = `${collected.first().content}`
														console.log(survey)
														interaction.followUp(`Fair enough! That's as good a reason as any!`)
													});
											});
									});
							});
						
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