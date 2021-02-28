const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { get } = require('unirest');

module.exports = class ServerCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'server',
			aliases: [],
			memberName: 'server',
			group: 'info',
			description: 'View information about a server.',
			args: [
				{
					key: 'server',
					prompt: 'What server do you want to view?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { server }) {
		let url = `https://api.minehut.com/server/${server}`;
		if(server.length <= 10 && server.length >= 4) url += '?byName=true'; 
		const res = await get(url);
		if(res.status !== 200) return msg.reply('couldn\'t find a server with that name or ID!');
		const info = res.body.server;
		msg.channel.send(
			new MessageEmbed()
				.setTitle(info.name)
				.setColor('BLUE')
				.setDescription(info.motd)
				.addField('Server ID', info._id, true)
				.addField('Online?', String(info.online), true)
				.setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
		);
	}
};