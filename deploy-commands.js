// Must first add bot to server before running this command. Then add server and bot id in '.env' for them to be correctly deployed to the server.

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('survey').setDescription('Starts a survey!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);