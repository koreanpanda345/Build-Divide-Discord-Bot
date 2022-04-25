import { airtableBase, discordClient } from "../../constants/instances";
import { createDiscordEvent } from "../../utils/helpers";

createDiscordEvent({
	name: 'ready',
	run_once: true,
	disabled: false,
	invoke: async () => {
		console.log('Bot is ready');
		await discordClient.user?.setActivity({
			name: 'Teruto make bread',
			type: 'WATCHING'
		});
	}
});