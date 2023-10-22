// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const dotevn = require('dotenv')

dotevn.config()

// information of .env
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

// show the routes of .js files
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const commands = require(filePath)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in commands && 'execute' in commands) {
		client.commands.set(commands.data.name, commands)
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
		)
	}
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.login(TOKEN)

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			})
		}
	}
})
