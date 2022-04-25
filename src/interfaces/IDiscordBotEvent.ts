export interface IDiscordBotEvent {
	name: string;
	run_once?: boolean;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<void>;
}