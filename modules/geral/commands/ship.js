const Discord = require('discord.js');
const { Command } = require('../../../handler');
const { getMember } = require('../events/functions.js');

module.exports = class extends Command {
    constructor() {
        super('ship', {
            aliases: ['casal'],
            info: 'Descubra qual a porcentagem de chance de unir um casal',
            usage: 'ship <@menção1> <@menção2>',
            guildOnly: false,
        });
    }

    async run (message, args) {
        let person = getMember(message, args[0]);

        if (!person || message.author.id === person.id) {
            person = message.guild.members
            .filter(m => m.id !== message.author.id)
            .random();
        }

        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .addField(`**Resultado do ship de ${person.displayName} e ${message.member.displayName}**`,
        `💟 ${Math.floor(love)}%\n\n${loveLevel}`);

        message.channel.send(embed);
    }
}