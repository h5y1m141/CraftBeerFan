var mainController;

mainController = (function() {

  function mainController() {
    var ShopDataDetailWindow;
    ShopDataDetailWindow = require("ui/shopDataDetailWindow");
    this.shopDataDetailWindow = new ShopDataDetailWindow();
  }

  mainController.prototype.updateShopDataDetailWindow = function(data) {
    return this.shopDataDetailWindow.update(data);
  };

  mainController.prototype.findNearBy = function() {};

  return mainController;

})();

module.exports = mainController;
