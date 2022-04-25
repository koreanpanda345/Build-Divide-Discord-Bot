import { Message } from "discord.js";
import { botCache } from "../../constants/instances";
import { createDiscordMonitor } from "../../utils/helpers";

createDiscordMonitor({
	name:'command_monitor',
	disabled: false,
	invoke: async (message: Message) => {
		const prefix = process.env.DISCORD_BOT_PREFIX as string;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift()?.toLowerCase() as string;
		
		const command = botCache.commands.get(commandName) || botCache.commands.find((c) => c.info.aliases! && c.info.aliases.includes(commandName));

		if(!command) return;

		if(command.preconditions?.disabled) {
			message.reply(`${command.info.name} is disabled. Please try again later.`);
			return;
		}

		try {
			await command.invoke!(message, args);
		} catch (error) {
			console.error(error);
		}
	}
})