class mainController
  constructor:() ->
    ShopDataDetailWindow = require("ui/shopDataDetailWindow")
    @shopDataDetailWindow = new ShopDataDetailWindow()
    

  updateShopDataDetailWindow:(data) ->
    return @shopDataDetailWindow.update(data)
    
  findNearBy:() ->
    return
  
module.exports = mainController  