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
		const all_plugins_res = await get('https://api.minehut.com/plugins_public');
		const all_plugins = all_plugins_res.body.all;
		let plugins = [];
		for(const i of info.active_plugins) {
			plugins.push(all_plugins.filter(x => x._id === i)[0].name);
		}
		let properties = '';
		for(const i in info.server_properties) {
			const value = info.server_properties[i];
			properties += `**${(() => {
				const arr = i.split('_');
				for(const o of arr) {
					arr[arr.indexOf(o)] = o[0].toUpperCase() + o.substr(1).toLowerCase()
				}
				const builder = arr.join(' ');
				return builder;
			})()}** \`${String(value) === '' ? ' ' : String(value).replace(/`/g, '').substr(0, 50)}\`\n`;
		}
		msg.channel.send(
			new MessageEmbed()
				.setTitle(`${info.name} ${info.visibility ? '' : '(unlisted)'}`)
				.setColor(info.online ? 'GREEN' : 'RED')
				.setDescription(info.motd.replace(/(&|§)([A-Fa-f0-9blkuo])/g, ''))
				.addField('Player Count', `${info.playerCount}/${info.maxPlayers}`, true)
				.addField('Server ID', info._id, true)
				.addField('Suspended?', String(info.suspended), true)
				.addField('Plugins', plugins.map(p => `⋆ ${p}`).join('\n'))
				.addField('Server Properties', properties.trim())
				.setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
		);
	}
};