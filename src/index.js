const { CommandoClient } = require('discord.js-commando')
const { config } = require('dotenv');
const { join } = require('path');

config({ path: join(__dirname, '../.env') });

const bot = new CommandoClient({
	commandPrefix: process.env.PREFIX,
	owner: ['194137531695104000'],
});

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user?.tag}!`);
});

bot.registry
	.registerDefaultTypes()
	.registerGroups([
		['info', 'Info Commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommand: false,
	})
	.registerCommandsIn(join(__dirname, 'commands'));

bot.login(process.env.TOKEN);