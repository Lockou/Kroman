const { Client } = require('discord.js');

const Feature = require('./Feature.js');
const Command = require('./Command.js');
const Event = require('./Event.js');
const Utils = require('../Utils.js');

class Handler {
  /**
   * @description Crie uma nova instância do manipulador
   * @param {Client} client - O cliente discord.js
   * @param {string} prefix - O prefixo do bot
   */
  constructor(client, prefix) {
    /**
     * O cliente discord.js
     * @type {Client}
     */
    this.client = client;

    /**
     * O prefixo do bot
     * @type {string}
     */
    this.prefix = prefix;

    /**
     * Um mapa de todos os recursos
     * @type {Map<string, Feature>}
     */
    this.features = new Map();

    /**
     * Um mapa contendo todos os comandos, mapeados pelo nome do comando
     * @type {Map<string, Command>}
     */
    this.commands = new Map();

    /**
     * Um mapa contendo todos os comandos, mapeados por alias
     * @type {Map<string, Command>}
     */
    this.aliases = new Map();

    /**
     * Um mapa contendo todos os eventos, mapeados pelo nome do evento
     * @type {Map<string, Array<Event>>}
     */
    this.events = new Map();
  }

  /**
   * @description Carregue todos os módulos de comando / evento de um diretório
   * @param {string} directory - O diretório dos módulos
   * @param {object} dependencies - As dependências dos módulos
   * @returns {undefined}
   */
  load(directory, dependencies) {
    this.directory = directory;
    this.dependencies = dependencies;

    // Encontre e exija todos os arquivos JavaScript
    const nodes = Utils.readdirSyncRecursive(directory)
      .filter(file => file.endsWith('.js'))
      .map(require);

    // Carregar todos os recursos
    nodes.forEach(Node => {
      if (Node.prototype instanceof Feature) {
        this.loadFeature(new Node(dependencies));
      }
    });

    // Carregar todas as classes de comando e evento que ainda não foram carregadas
    nodes.forEach(Node => {
      if (Node.prototype instanceof Command) {
        const loaded = Array.from(this.commands.values()).some(
          command => command instanceof Node,
        );

        if (!loaded) {
          this.loadCommand(new Node(dependencies));
        }
      }

      if (Node.prototype instanceof Event) {
        const loaded = Array.from(this.events.values()).some(events =>
          events.some(event => event instanceof Node),
        );

        if (!loaded) {
          this.loadEvent(new Node(dependencies));
        }
      }
    });

    // Registrar comandos e eventos carregados
    this.register();
  }

  /**
   * @description Carrega um recurso e seus comandos
   * @param {Feature} feature - O recurso que precisa ser carregado
   */
  loadFeature(feature) {
    if (this.features.has(feature.name)) {
      throw new Error(
        `Não é possível carregar o recurso, o nome '${feature.name}' já está sendo usado.`,
      );
    }

    this.features.set(feature.name, feature);

    feature.commands.forEach(command => {
      this.loadCommand(command);
    });

    feature.events.forEach(event => {
      this.loadEvent(event);
    });
  }

  /**
   * @description Carregar um comando
   * @param {Command} command - O comando que precisa ser carregado
   */
  loadCommand(command) {
    // O nome do comando pode estar em uso ou o nome já pode ser um alias existente
    if (this.commands.has(command.name) || this.aliases.has(command.name)) {
      throw new Error(
        `Não é possível carregar o comando, o nome '${command.name}' já é usado como um nome de comando ou alias`,
      );
    }

    this.commands.set(command.name, command);

    command.aliases.forEach(alias => {
      // O alias pode já ser um comando ou já estar em uso
      if (this.commands.has(alias) || this.aliases.has(alias)) {
        throw new Error(
          `Não é possível carregar o comando, o alias '${alias}' já é usado como um nome de comando ou alias`,
        );
      }

      this.aliases.set(alias, command);
    });
  }

  /**
   * @description Carregar um evento
   * @param {Event} event - O evento que precisa ser carregado
   */
  loadEvent(event) {
    const events = this.events.get(event.eventName) || [];
    events.push(event);

    this.events.set(event.eventName, events);
  }

  /**
   * @description Registrar os manipuladores de comando e evento
   */
  register() {
    // Manipular eventos
    for (const [name, handlers] of this.events) {
      this.client.on(name, (...params) => {
        for (const handler of handlers) {
          // Executar evento, se ativado
          if (handler.isEnabled) {
            try {
              handler.run(this.client, ...params);
            } catch (err) {
              console.error(err);
            }
          }
        }
      });
    }

    // Manipular comandos
    this.client.on('message', async message => {
      if (message.author.bot || !message.content.startsWith(this.prefix)) {
        return;
      }

      // Remova o prefixo e divida a mensagem em command e args
      const [command, ...args] = message.content
        .slice(this.prefix.length)
        .split(' ');

      let cmd = this.commands.get(command.toLowerCase());

      if (!cmd) {
        // Obter o comando por alias
        cmd = this.aliases.get(command.toLowerCase());
      }

      if (!cmd || !cmd.isEnabled) {
        // Nenhum comando ou alias encontrado ou comando está desativado
        return;
      }

      if (cmd.guildOnly && !message.guild) {
        message.channel.send('Este comando está disponível apenas em guildas');
        return;
      }

      try {
        await cmd.run(message, args);
      } catch (err) {
        console.error(err);
        message.reply('bleep bloop ocorreu um erro');
      }
    });
  }
}

module.exports = Handler;