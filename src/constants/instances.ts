import { config } from "dotenv";
config();
import { Client, Collection, Intents } from "discord.js";
import Airtable from "airtable";
import { IDiscordBotCommand } from "../interfaces/IDiscordBotCommand";
import { IDiscordBotEvent } from "../interfaces/IDiscordBotEvent";
import { IDiscordBotMonitor } from "../interfaces/IDiscordBotMonitor";

Airtable.configure({
	apiKey: process.env.AIRTABLE_KEY as string,
	endpointUrl: 'https://api.airtable.com',
});

export const discordClient = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

export const botCache = {
	commands: new Collection<string, IDiscordBotCommand>(),
	events: new Collection<string, IDiscordBotEvent>(),
	monitors: new Collection<string, IDiscordBotMonitor>(),
	interactions: {
		buttons: new Collection<string, any>(),
		select_menus: new Collection<string,any>(),
		slash_commands: new Collection<string, any>()
	}
};



export const airtableBase = Airtable.base(process.env.AIRTABLE_BASE as string);

