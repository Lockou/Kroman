const { Command } = require('../../../handler');
const { client } = require('discord.js');

module.exports = class extends Command {
    constructor() {
        super('apagar', {
            aliases: ['clear', 'deletar', 'apg', 'dlt', 'purge'],
            info: 'Você utiliza este comando para deletar o tanto de mensagens possível em seu servidor',
            usage: 'apagar <total>',
            guildOnly: true,
        });
    }

    async run(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR'))
        return message.reply('**Você não tem permissão para utilizar esse comando.**');
        const deleteCount = parseInt(args[0], 10);
        if(!deleteCount || deleteCount <1 || deleteCount >100)
        return message.reply('Ponha do número 1 à 100 para que eu possa apagar.');

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
        .then(deleted => message.channel.send(`**Eu deletei ${deleted.size} mensagens**`))
        .catch(error => message.reply(`Alguma coisa deu errado creio que seja ${error}`))
    }
}