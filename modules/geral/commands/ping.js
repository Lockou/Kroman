const { stripIndents } = require('common-tags');

const { Command } = require('../../../handler');

module.exports = class extends Command {
    constructor() {
        super('ping', {
            aliases: ['ms'],
            info: 'Recebe a latência de ping do bot',
            usage: 'ping',
            guildOnly: false,
        });
    }

    async run(message) {
        const msg = await message.channel.send('Carregando...');
        const ping = Math.round(msg.createdTimestamp - message.createdTimestamp);

        if (ping <= 0) {
            return msg.edit('**Por favor tente novamente**');
        }

        return msg.edit(
            stripIndents`
            🏓 P${'o'.repeat(Math.ceil(ping / 100))}ng: \`${ping}ms\`
      💓 Batimento cardiaco: \`${Math.round(message.client.ping)}ms\`
      `,
        );
    }
};