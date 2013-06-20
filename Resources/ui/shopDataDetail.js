var shopDataDetail;

shopDataDetail = (function() {

  function shopDataDetail(data) {
    var addressRow, backButton, phoneRow, shopData, shopDataWindow;
    shopDataWindow = Ti.UI.createWindow({
      title: "詳細情報",
      barColor: "#ccc",
      backgroundColor: "#f9f9f9"
    });
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return shopDataWindow.close({
        animated: true
      });
    });
    shopDataWindow.leftButton = backButton;
    shopData = [];
    this.section = Ti.UI.createTableViewSection({
      headerTitle: "",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    addressRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40,
      selectedColor: 'transparent'
    });
    this.addressLabel = Ti.UI.createLabel({
      text: "",
      width: 280,
      left: 20,
      top: 10,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    phoneRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40,
      selectedColor: 'transparent'
    });
    this.phoneLabel = Ti.UI.createLabel({
      text: "",
      left: 20,
      top: 10,
      width: 150,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    this.callBtn = Ti.UI.createButton({
      title: 'call',
      width: 50,
      height: 25,
      left: 180,
      top: 10
    });
    addressRow.add(this.addressLabel);
    phoneRow.add(this.phoneLabel);
    phoneRow.add(this.callBtn);
    shopData.push(this.section);
    shopData.push(addressRow);
    shopData.push(phoneRow);
    this.tableView = Ti.UI.createTableView({
      width: 'auto',
      height: 'auto',
      data: shopData,
      backgroundColor: "#f3f3f3",
      separatorColor: '#cccccc',
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    });
    this.tableView.hide();
  }

  shopDataDetail.prototype.show = function() {
    return this.tableView.show();
  };

  shopDataDetail.prototype.getTable = function() {
    return this.tableView;
  };

  shopDataDetail.prototype.setData = function(data) {
    this.addressLabel.setText(data.annotation.shopAddress);
    this.phoneLabel.setText(data.annotation.phoneNumber);
    this.callBtn.addEventListener('click', function(e) {
      return Titanium.Platform.openURL("tel:" + data.annotation.phoneNumber);
    });
    this.section.setHeaderTitle(data.title);
  };

  return shopDataDetail;

})();

module.exports = shopDataDetail;
