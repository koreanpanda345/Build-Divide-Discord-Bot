export interface IDiscordBotMonitor {
	name: string;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<unknown>;
}