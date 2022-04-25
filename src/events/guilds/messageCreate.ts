import { createDiscordEvent } from "../../utils/helpers";
import { Message } from 'discord.js';
import { botCache } from "../../constants/instances";

createDiscordEvent({
	name: 'messageCreate',
	disabled: false,
	invoke: async (message: Message) => {
		if(message.author.bot) return;
		const prefix = process.env.DISCORD_BOT_PREFIX as string;

		if(!message.content.toLowerCase().startsWith(prefix)) return;

		const commandMonitor = botCache.monitors.get('command_monitor');
		
		if(commandMonitor?.disabled) return;

		try {
			await commandMonitor?.invoke(message);
		} catch (error) {
			console.error(error);
		}

	}
})