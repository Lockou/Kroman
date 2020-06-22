const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { getMember, formatDate } = require('../events/functions.js');
const { Command } = require('../../../handler');

module.exports = class extends Command {
    constructor() {
        super('sobre', {
            aliases: ['whois'],
            info: 'Saber sobre o perfil da pessoa mencionada',
            usage: 'sobre <@menção>',
            guildOnly: false,
        });
    }

    async run(message, args) {
        const member = getMember(message, args.join(' '));

        const entrada = formatDate(member.joinedAt);

      //  const roles = member.roles
      //  .filter(r => r.id !== message.guild.id)
      //  .map(r => r)
      //  .join(', ') || 'none';

        const criado = formatDate(member.user.createdAt);

        const embed = new Discord.MessageEmbed()
        .setFooter(member.displayName, member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Informação do member:', stripIndents`**• Nome em exibição:** ${member.displayName}
        **• Entrou em:** ${entrada}`, true)

        .addField('Informação do usuário', stripIndents`**• ID:** ${member.user.id}
        **• Nome do usuário:** ${member.user.username}
        **• Tag:** ${member.user.tag}
        **• Criado em:** ${criado}`, true)

        .setTimestamp()

        if (member.user.presence.activities)
        embed.addField('Jogando neste momento', stripIndents`** ${member.user.presence.activities.name}`);

        message.channel.send(embed);
    }
}