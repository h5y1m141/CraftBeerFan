var Client;

Client = (function() {

  function Client() {
    var Menu, screen;
    Menu = require("configurationWizard/menu");
    this.Command = require("configurationWizard/command");
    screen = require("configurationWizard/screen");
    this.items = new screen();
    this.menu = new Menu();
  }

  Client.prototype.useMenu = function(selectedNumber) {
    this.menu.addCommands(new this.Command(this.items));
    return this.menu.run(selectedNumber);
  };

  return Client;

})();

module.exports = Client;
