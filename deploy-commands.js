// routes discord js
const { REST, Routes } = require('discord.js')
const dotevn = require('dotenv')
// import commands
const fs = require('node:fs')
const path = require('node:path')

// dotenv
dotevn.config()
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'))

const commands = []

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	commands.push(command.data.toJSON())
}

// instanc rest
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// deploy
(async () => {
	try {
		console.log(`reset ${commands.length} commands...`)
		// PUT
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)

		console.log('Commands registred!')
	} catch (error) {
		console.error(error)
	}

})()
