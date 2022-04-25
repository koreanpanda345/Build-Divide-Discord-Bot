import { Record, FieldSet } from "airtable";
import { MessageEmbed } from "discord.js";
import { airtableBase, discordClient } from "../../constants/instances";
import { createDiscordCommand } from "../../utils/helpers";

createDiscordCommand({
	info: {
		name: 'search',
		description: 'Searchs for a card by name (Either english or japanese).',
		category: 'Card Database'
	},

	invoke: async (message, args) => {
		const query = args.join(' ');
		if(query === '') {
			message.reply(`Please try this command again, but proivde the card you want to search for.`);
			return;
		}
		await message.channel.sendTyping()
		let result: Record<FieldSet> | null = await new Promise(async (resolve, reject) => {
			await airtableBase('Card Database').select({view: 'All Cards'}).all().then((records) => {
				records.forEach((record) => {
					if(record.get('Name')?.toString().toLowerCase().includes(query.toLowerCase()) || record.get('Japanese Name')?.toString().includes(query.toLowerCase()))
						return resolve(record);
				})
				return resolve(null);
			})
		})

		let embed = new MessageEmbed();

		if(result != null) {
			embed.setTitle(`${result.get('Name')}`);
			embed.setAuthor({
				name: `JP: ${result.get('Japanese Name')}`
			});
			embed.setDescription(`${result.get('Card Text')}`);
			if((result.get('Card Type') as string[]) != undefined)
				embed.addField(`Card Type`, (result.get('Card Type') as string[]).join(' | '));
			if((result.get('Attributes') as string[]) != undefined)
				embed.addField(`Card Attributes`, (result.get('Attributes') as string[]).join(' | '));
			embed.setImage(((result.get('Card Image') as any[])[0].thumbnails.full.url as string));
			embed.setColor(
				result.get('Color Divide') == "Red Divide" ? 'RED' :
				result.get('Color Divide') == "Blue Divide" ? 'BLUE' :
				result.get('Color Divide') == "Black Divide" ? 'DARK_BUT_NOT_BLACK' :
				result.get('Color Divide') == "White Divide" ? 'WHITE' : 'GREY'
			);

		} else {
			embed.setTitle('Could not find a card.');
			embed.setColor('ORANGE');
			embed.setDescription('Make sure you spelt the name correctly. You do not need to put the full name of the card, however it does make the query more accurate.');
			embed.addField('Example', '`b!search casino` -> Casino of Doom\n`b!search bloom` -> Bloom, Soul Gambler\n`b!search cursed trump card` -> Cursed Trump Card');

		}
		embed.setFooter({
			text: 'Build Divide TCG Community',
			iconURL: discordClient.user?.displayAvatarURL()
		});
		message.reply({embeds: [embed]});
	}
})