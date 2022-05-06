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
		const survey = [];
		

		const filter = m => { return interaction.user.id === m.author.id };

		interaction.reply('Welcome to the survey command. Firstly, what is your name?', { fetchReply: true })
			.then(() => {
				interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
					.then(collected => {
						survey.name = `${collected.first().content}`
						//console.log(survey)
						interaction.followUp(`What is your favorite candy?`)
							.then(() => {
								interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
									.then(collected => {
										survey.candy = `${collected.first().content}`
										//console.log(survey)
										interaction.followUp(`I'm not sure I like that candy... Why do you enjoy it so?`)
											.then(() => {
												interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
													.then(collected => {
														survey.reason = `${collected.first().content}`
														interaction.followUp(`Fair enough! That's as good a reason as any!`)

														//console.log(survey)

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