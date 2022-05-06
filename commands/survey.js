const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');
const AWS = require('aws-sdk');
// Update our AWS Connection Details
AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
// Create the service used to connect to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('survey')
		.setDescription('Starts a survey!'),
	async execute(interaction) {
		const survey = {};
		const filter = m => { return interaction.user.id === m.author.id };

		try {
			await interaction.reply('Welcome to the survey command. Firstly, what is your name?', { fetchReply: true })

			let collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
			survey.name = `${collected.first().content}`

			await interaction.followUp(`What is your favorite candy?`)
			collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
			survey.candy = `${collected.first().content}`

			await interaction.followUp(`I'm not sure I like that candy... Why do you enjoy it so?`)
			collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
			survey.reason = `${collected.first().content}`

			await interaction.followUp(`Fair enough! That's as good a reason as any!`)

			const params = {
				TableName: 'comp-discord-bot',
				Item: {
					// Use Date.now().toString() just to generate a unique value
					id: Date.now().toString(),
					// `info` is used to save the actual data
					info: survey
				}
			}

			docClient.put(params, (error) => {
				if (!error) {
					// Finally, return a message to the user stating that the app was saved
					return interaction.followUp(`We've successfully saved your response. Thank you!`)
				} else {
					throw "Unable to save record, err" + error
				}
			})

		} catch (err) {
			await interaction.followUp(`Looks like you didn't respond in time.`);
		}
	}
}