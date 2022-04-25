import { discordClient } from "./constants/instances"
import { LoadFiles } from "./utils/loaders";


export default new class {
	async startBot() {
		await LoadFiles(['commands', 'events', 'monitors']);
		discordClient.login(process.env.DISCORD_BOT_TOKEN as string);
	}
}