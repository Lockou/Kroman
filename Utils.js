const fs = require('fs');
const path = require('path');

class Utils {
    /**
     * @description Leia um diretório recursivamente para obter todos os arquivos
     * @param {string} directory - O diretório para ler
     * @returns {Array<string>} Todos os caminhos para os arquivos
     */

     static readdirSyncRecursive(directory) {
         let files = [];

         fs.readdirSync(directory).forEach(file => {
             const location = path.join(directory, file);

             // Se o arquivo for um diretório, leia-o recursivamente
             if (fs.lstatSync(location).isDirectory()) {
                 files = files.concat(Utils.readdirSyncRecursive(location));
             } else {
                 files.push(location);
             }
         });

         return files;
     }

     /**
      * @description Torna um objeto booleano Sim ou Não.
      * @param {boolean} bool - O booleano para stringify.
      * @returns {string} Booleano como Sim ou Não, de acordo.
      */
     static boolToString(bool) {
         if (typeof bool === 'boolean') {
             return bool ? 'Sim' : 'Não';
         }
         return String(bool);
     }
}

module.exports = Utils;