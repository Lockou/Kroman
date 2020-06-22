class Toggleable {
    constructor() {
      this.isEnabled = true;
    }
  
    /**
     * @description Alternar isEnabled
     */
    toggle() {
      this.isEnabled = !this.isEnabled;
    }
  
    /**
     * @description Alterações isEnabled para true.
     */
    enable() {
      this.isEnabled = true;
    }
  
    /**
     * @description Alterações isEnabled para false.
     */
    disable() {
      this.isEnabled = false;
    }
  }
  module.exports = Toggleable;