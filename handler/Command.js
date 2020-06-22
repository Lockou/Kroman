const Toggleable = require('./Toggleable');

class Command extends Toggleable {
    /**
     * @description Cria um novo comando
     * @param {string} name - o nome do comando
     * @param {object} options - A opção para este comando
     * @param {Array<string>} [options.aliases] - Alias deste comando
     * @param {string} [options.info] - Informação sobre esse comando
     * @param {string} [options.usage] - Uso deste comando
     * @param {boolean} [options.guildOnly] - Se o comando pode ser usado apenas dentro de uma guilda
     */
    constructor(name, options) {
        super();

        this.name = name;

        if(!Array.isArray(options.aliases)) {
            throw new TypeError('Os aliases devem ser uma matriz');
        }
        options.aliases.forEach(alias => {
            if (typeof alias !== 'string') {
                throw new TypeError('A matriz de aliases deve conter apenas cadeias');
            }
        });
        this.aliases = options.aliases;

        if (!(typeof options.info === 'string')) {
            throw new TypeError('As informações devem ser uma sequência');
        }
        this.info = options.info;

        if (!(typeof options.usage === 'string')) {
            throw new TypeError('O uso deve ser uma sequência');
        }
        this.usage = options.usage;

        if (!(typeof options.guildOnly === 'boolean')) {
            throw new TypeError('A guilda deve ser apenas booleana');
        }
        this.guildOnly = options.guildOnly;
    }

    /**
     * @description Método que é executado quando o comando é executado
     */
     run() {
         throw new Error(`O comando '${this.name}' está ausente no método de execução`)
     }
}

module.exports = Command;