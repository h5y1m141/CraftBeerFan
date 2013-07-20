class Client
  constructor:() ->
    Menu = require("configurationWizard/menu")

    @Command = require("configurationWizard/command")
    screen = require("configurationWizard/screen")
    @items = new screen()    
    @menu = new Menu()
    

  useMenu:(selectedNumber) ->
    @menu.addCommands(new @Command(@items))    
    @menu.run(selectedNumber)

module.exports = Client