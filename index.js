if (Number(process.version.slice(1).split(' ')[0]) < 10)
    throw new Error(
        'O Node 10.0.0 ou superior é necessário. Atualize o Node no seu sistema.'
    );

const path = require('path');

// Variáveis
const { Client } = require('discord.js');
const { Handler } = require('./handler');
const { token } = require('./config.json');

// Base
const client = new Client({disabledEveryone: true });
const handler = new Handler(client, '</');

handler.load(path.join(__dirname, './modules'), {
    client,
    commandHandler: handler,
});

// Ligamento do bot
client.login(token);