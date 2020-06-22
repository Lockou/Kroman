const Command = require('./Command.js');
const Event = require('./Event.js');
const Toggleable = require('./Toggleable.js');

class Feature extends Toggleable {
  /**
   * @description Crie um novo recurso
   * @param {string} name - O nome deste recurso
   */
  constructor(name) {
    super();

    if (typeof name !== 'string') {
      throw new TypeError('Feature name must be a string');
    }

    /**
     * O nome desse recurso
     * @type {String}
     */
    this.name = name;

    /**
     * Todos os comandos que pertencem a este recurso
     * @type {Array<Command>}
     */
    this.commands = [];

    /**
     * Todos os eventos que pertencem a este recurso
     * @type {Array<Event>}
     */
    this.events = [];
  }

  /**
   * @description Registrar um novo comando
   * @param {Command} command - O comando que precisa ser registrado
   */
  registerCommand(command) {
    if (!(command instanceof Command)) {
      throw new TypeError("Não é possível registrar o comando, ele não estende o comando");
    }

    this.commands.push(command);
  }

  /**
   * @description Registrar um novo evento
   * @param {Event} event - O evento que precisa ser registrado
   */
  registerEvent(event) {
    if (!(event instanceof Event)) {
      throw new TypeError("Não é possível registrar o evento, ele não estende o Evento");
    }

    this.events.push(event);
  }

  /**
   * @description Alterne este recurso e seus comandos e eventos
   * @returns {undefined}
   * @override
   */
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * @description Habilite esse recurso e seus comandos e eventos
   * @returns {undefined}
   * @override
   */
  enable() {
    super.enable();

    this.commands.forEach(command => command.enable());
    this.events.forEach(event => event.enable());
  }

  /**
   * @description Desabilite esse recurso e seus comandos e eventos
   * @returns {undefined}
   * @override
   */
  disable() {
    super.disable();

    this.commands.forEach(command => command.disable());
    this.events.forEach(event => event.disable());
  }
}

module.exports = Feature;