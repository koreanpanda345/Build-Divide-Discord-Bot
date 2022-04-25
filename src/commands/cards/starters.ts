import { FieldSet, Record, Records } from "airtable";
import { MessageEmbed } from "discord.js";
import { airtableBase, discordClient } from "../../constants/instances";
import { createDiscordCommand } from "../../utils/helpers";

createDiscordCommand({
	info: {
		name: 'starters',
		aliases: ['starter', 'start'],
		description: 'Gives you a list of starters, or the deck list for a starter deck.',
		category: 'Card Database',
	},
	preconditions:{
		disabled: false
	},

	invoke: async (message, args) => {
		await message.channel.sendTyping();
		let results: Records<FieldSet> = await new Promise(async (resolve, reject) => {
			await airtableBase('Starter Decks').select().all().then((records) => {
				return resolve(records);
			})
		});

		let query = args.join(' ');
		let embed = new MessageEmbed();
		if(args.length == 0) {
			embed.setTitle('List of Starter Decks');
			for(const deck of results) {
			let ace: Record<FieldSet> = await new Promise(async (resolve, reject) => {
				await airtableBase('Card Database').find((deck.get('Ace') as string[])[0] as string).then((record)=> {
					return resolve(record);
				})
			})
				embed.addField(`${deck.get('Name')}`, `Ace Card: ${ace.get('Name')}`);
			}
			embed.setColor('RANDOM');
		} else {
			let deck = results.find((x) => x.get('Name')?.toString().toLowerCase().includes(query.toLowerCase()));

			if(!deck) {
				message.reply("Could not find that starter deck.");
				return;
			}

			let ace: Record<FieldSet> = await new Promise(async (resolve, reject) => {
				await airtableBase('Card Database').find((deck!.get('Ace') as string[])[0] as string).then((record)=> {
					return resolve(record);
				});
			});

			embed.setTitle(`Deck List for Starter Deck - ${deck.get('Name')}`);
			embed.setAuthor({
				name: `Ace Card: ${ace.get('Name')}`,
				// iconURL: ((ace.get('Card Image') as any[])[0].thumbnails.small.url as string)
			});
			embed.setThumbnail(((ace.get('Card Image') as any[])[0].thumbnails.full.url as string));
			embed.setColor(
				ace.get('Color Divide') == "Red Divide" ? 'RED' :
				ace.get('Color Divide') == "Blue Divide" ? 'BLUE' :
				ace.get('Color Divide') == "Black Divide" ? 'DARK_BUT_NOT_BLACK' :
				ace.get('Color Divide') == "White Divide" ? 'WHITE' : 'GREY'
			)
			embed.setDescription(`${deck.get('Deck List')}`);

		}
		embed.setFooter({
			text: 'Build Divide TCG Community',
			iconURL: discordClient.user?.displayAvatarURL()
		});
		message.channel.send({embeds: [embed]});
	}
})