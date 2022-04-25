import { botCache, discordClient } from "../constants/instances";
import { IDiscordBotCommand } from "../interfaces/IDiscordBotCommand";
import { IDiscordBotEvent } from "../interfaces/IDiscordBotEvent";
import { IDiscordBotMonitor } from "../interfaces/IDiscordBotMonitor";

export function createDiscordCommand(command: IDiscordBotCommand) {

	if(botCache.commands.has(command.info.name)) return;
	
	botCache.commands.set(command.info.name, command);

	console.log(`Command Register: ${command.info.name}`);
}

export function createDiscordEvent(event: IDiscordBotEvent) {
	
	if(botCache.events.has(event.name)) return;

	if(event.disabled) return;

	if(event.run_once) discordClient.once(event.name, async (...args) => await event.invoke(...args));
	else discordClient.on(event.name, async (...args) => await event.invoke(...args));

	botCache.events.set(event.name, event);

	console.log(`Event Register: ${event.name}`);
}

export function createDiscordMonitor(monitor: IDiscordBotMonitor) {

	if(botCache.monitors.has(monitor.name)) return;

	botCache.monitors.set(monitor.name, monitor);

	console.log(`Monitor Register: ${monitor.name}`);
}
