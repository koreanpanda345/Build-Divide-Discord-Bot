import { FieldSet, Records } from "airtable";
import { MessageEmbed } from "discord.js";
import { airtableBase } from "../../constants/instances";
import { createDiscordCommand } from "../../utils/helpers";

createDiscordCommand({
	info: {
		name: "whatis",
		aliases: ["what", "define"],
		description: "Defines a card term.",
		category: "Card Database"
	},
	preconditions: {
		disabled: false
	},

	invoke: async (message, args) => {
		let embed = new MessageEmbed();
		let result: Records<FieldSet> = await new Promise(async (resolve, reject) => {
			await airtableBase('Card Terms').select().all().then((records) => {
				return resolve(records);
			})
		})

		let query = args.join(" ");

		if(args.length == 0) {
			// List of card terms.

			embed.setTitle('Card Terms');
			let desc = "";
			result.forEach((record) => {
				desc += `${record.get("Term")}\n`;
			})
			embed.setDescription(desc);
			embed.setColor('RANDOM');
		} else {
			let term = result.find((x) => x.get("Term")?.toString().toLowerCase().includes(query.toLowerCase()));

			if(!term) {
				embed.setTitle("Could not find a term called that.");
				embed.setDescription("Check to see if you spelt the term correctly.");
				embed.setColor('ORANGE');
				
			} else {
				embed.setTitle(`${term.get('Term')}`);
				embed.setDescription(`${term.get('Description')}`);
				embed.setImage(((term.get('Card Image') as any[])[0].thumbnails.full.url as string));
				embed.setColor('RANDOM');
			}
		}

		message.channel.send({embeds: [embed]});
	}
})