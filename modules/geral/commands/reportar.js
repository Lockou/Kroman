const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { Command } = require('../../../handler');

module.exports = class extends Command {
    constructor() {
        super('reportar', {
            aliases: ['report', 'denunciar'],
            info: 'Utilizado para reportar o usuário',
            usage: 'reportar <@menção> <texto>',
            guildOnly: false,
        })
    }

    async run(message, args) {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!rMember)
        return message.reply('Não consigo encontrar a pessoa mencionada').then(m => m.delete({timeout: 5000}));
        
        if (rMember.hasPermission('BAN_MEMBERS') || rMember.user.bot)
        return message.channel.send('Não é possível reportar esse membro').then(m => m.delete({timeout: 5000}));

        if (!args[1])
        return message.channel.send('Forneça um motivo para a reportagem').then(m => m.delete({timeout: 5000}));

        const channel = message.guild.channels.cache.find(c => c.name === 'reportagens')

        if (!channel)
        return message.channel.send(`Não consigo encontrar o canal '#reportagens'`).then(m => m.delete({timeout: 5000}));

        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTimestamp()
        .setFooter(message.guild.name, message.guild.iconURL())
        .setAuthor(`Usuário Reportado`, rMember.user.displayAvatarURL())
        .setDescription(stripIndents`**👥 Usuário: ${rMember}\n📌 ID:** ${rMember.user.id}
        **📢 Repotardo por:** ${message.member}
        **💬 Reportado no:** ${message.channel}
        **⚖️ Causa:** ${args.slice(1).join(' ')}`);

        return channel.send(embed);
    }
}