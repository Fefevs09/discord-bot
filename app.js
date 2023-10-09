// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');
const dotevn = require('dotenv');

dotevn.config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
/*
console.log(DISCORD_TOKEN);
console.log(CLIENT_ID);
console.log(GUILD_ID);
*/