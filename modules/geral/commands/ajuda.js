const Discord = require('discord.js');
const got = require('got');
const Path = require('path');
const { Command } = require('../../../handler');
const Utils = require('../../../Utils.js');

module.exports = class extends Command {
    constructor({ commandHandler }) {
        super('ajuda', {
            aliases: ['help', 'commands', 'cmds', 'comandos'],
            info: 'Mostra todos os comandos ou informações sobre um comando específico.',
            usage: 'ajuda [comando]',
            guildOnly: false,
        });

        this.commandHandler = commandHandler;
    }

    async run(message, args) {
        const prefix = this.commandHandler.prefix;
        let description;
    
        if (args.length === 0) {
          description = `
            __Recursos:__
            ${Array.from(this.commandHandler.features)
              .map(
                ([name, feature]) => `**${name}** - ${feature.commands.join(', ')}`,
              )
              .join('\n')}
            
            __Comandos:__
            ${Array.from(this.commandHandler.commands)
              .map(
                ([, command]) => `**${prefix}${command.usage}** - ${command.info}`,
              )
              .join('\n')}
          `;
        } else {
          let command = this.commandHandler.commands.get(args[0]);
    
          if (!command) {
            command = this.commandHandler.aliases.get(args[0]);
          }
    
          if (!command) {
            const erroEmbed = new Discord.MessageEmbed()
              .setTitle('Algo deu errado!')
              .setDescription('Comando inválido fornecido, tente novamente!');
    
            message.channel.send(erroEmbed);
            return;
          }
    
          const contributors = [];
          const path = Path.relative(
            process.cwd(),
            `${__dirname}/${command.name}.js`,
          ).replace(/\\+/g, '/');
    
          try {
            const response = await got(
              `https://api.github.com/repos/The-SourceCode/Open-SourceBot/commits?path=${path}`,
            );
    
            const body = JSON.parse(response.body);
            body.forEach(commit => {
              if (!contributors.includes(commit.author.login)) {
                contributors.push(commit.author.login);
              }
            });
          } catch (e) {
            // Ignore
          }
    
          description = `
            **Nome:** ${command.name}
            **Uso:** ${prefix}${command.usage}
            **Informação:** ${command.info}
            **Aliádos:** ${command.aliases.join(', ')}
            **Apenas Guild:** ${Utils.boolToString(command.guildOnly)}
            **Ativado:** ${Utils.boolToString(true) /* TODO: Implementar ativado */}
            
            **Contribuidores:** ${contributors
              .map(
                contributor =>
                  `[${contributor}](https://github.com/${contributor})`,
              )
              .join(', ')}
          `;
        }
    
        const ajudaEmbed = new Discord.MessageEmbed()
          .setTitle('Precisa de ajuda? Aqui estou eu!')
          .setDescription(
            `${description}\n(**[]** É opcional, **<>** É necessário)`,
          );
    
        message.channel.send(ajudaEmbed);
          message.delete({timeout: 1100});
      }
    };