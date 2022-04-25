import { Message } from "discord.js";

export interface IDiscordBotCommand {
	info: {
		name: string;
		aliases?: string[];
		description?: string;
		usages?: string[] | string;
		category?: string;
	};


	preconditions?: {
		disabled?: boolean;
		only?: {
			dm?: boolean;
			guild?: boolean;
		};
	};

	invoke?: (message: Message, args: string[]) => Promise<unknown>;
}