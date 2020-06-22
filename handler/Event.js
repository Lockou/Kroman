const Toggleable = require('./Toggleable.js');

class Event extends Toggleable {
  /**
   * @description Crie um novo evento
   * @param {string} eventName - O nome do evento
   */
  constructor(eventName) {
    super();

    this.eventName = eventName;
  }

  /**
   * @description Método executado quando o evento é disparado
   */
  run() {
    throw new Error('Falta o método de execução do evento');
  }
}

module.exports = Event;