import { MessageEmbed } from "discord.js";
import { botCache, discordClient } from "../../constants/instances";
import { createDiscordCommand } from "../../utils/helpers";

createDiscordCommand({
	info: {
		name: 'help',
		aliases: ['command', 'commands'],
		description: 'Displays a list of commands, or information about a command.',
		category: 'Information'
	},

	preconditions: {
		disabled: false
	},

	invoke: async (message, args) => {
		let embed = new MessageEmbed();

		if(args.length == 0) {
			// Display the command list.

			embed.setTitle('Command List');
			embed.setDescription('These are the commands that you can use currently.');

			let commands = botCache.commands;
			let cats: string[] = [];
			commands.forEach((cmd) => {
				if(!cmd.info.category) cmd.info.category = "Uncategorize";
				if(cmd.info.category && !cats.includes(cmd.info.category)) cats.push(cmd.info.category);
			});

			cats.forEach((cat) => {
				let cmds: string[] =[];
				commands.forEach((cmd) => {
					if(cmd.info.category == cat) cmds.push(cmd.info.name);
				});

				embed.addField(`${cat} [Total Commands: ${cmds.length}]`, `${cmds.join(', ')}`);
			});

			embed.setColor('RANDOM');
		} else {
			let query = args.join(' ');
			let command = botCache.commands.get(query) || botCache.commands.find((c) => c.info.aliases! &&c.info.aliases.includes(query));

			if(!command) {
				embed.setTitle('Could not find command');
				return;
			}

			embed.setTitle(`Command ${command.info.name}`);
			embed.setDescription(`${command.info.description || "No Description!!"}`);
			embed.setAuthor({
				name: `Aliases: ${command.info.aliases?.join(', ') || "--"}`
			});
			embed.setColor('RANDOM');
			embed.addField(`Usages`, `${(typeof command.info.usages == "string" ? command.info.usages : command.info.usages?.join('\n'))|| "None"}`);
		}
		embed.setFooter({
			text: 'Build Divide TCG Community',
			iconURL: discordClient.user?.displayAvatarURL()
		});
		message.channel.send({embeds: [embed]});
	}
})