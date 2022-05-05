// Create envs file to store discord_bot_token/client.login credentials.
require('dotenv').config();

// Import discord.js and create the client
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Register an event so that when the bot is ready, it will log a messsage to the terminal
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

// Register an event to handle incoming messages
client.on('messageCreate', async msg => {
  // This block will prevent the bot from responding to itself and other bots
  if(msg.author.bot) {
    return
  }

  // Check if the message starts with '!hello' and respond with 'world!' if it does.
  if(msg.content.startsWith("!hello")) {
    msg.reply("world!")
  }

  if(msg.content.startsWith("!dm")) {
    let messageContent = msg.content.replace("!dm", "")
    msg.member.send(messageContent)
  }
})

// client.login logs the bot in and sets it up for use. You'll enter your token here.
client.login(process.env.DISCORD_BOT_TOKEN);