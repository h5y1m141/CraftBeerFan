var shopDataDetail;

shopDataDetail = (function() {

  function shopDataDetail(data) {
    var addressRow, phoneRow, shopData, shopDataWindow;
    shopDataWindow = Ti.UI.createWindow({
      title: "詳細情報",
      barColor: "#DD9F00",
      backgroundColor: "#343434"
    });
    shopData = [];
    this.section = Ti.UI.createTableViewSection({
      headerTitle: data.title
    });
    addressRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40
    });
    this.addressLabel = Ti.UI.createLabel({
      text: data.annotation.shopAddress,
      width: 280,
      left: 20,
      top: 10
    });
    phoneRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40
    });
    this.phoneLabel = Ti.UI.createLabel({
      text: data.annotation.phoneNumber,
      left: 20,
      top: 10,
      width: 120
    });
    this.callBtn = Ti.UI.createButton({
      title: '電話する',
      width: 100,
      height: 25,
      left: 150,
      top: 10,
      phoneNumber: ""
    });
    this.callBtn.addEventListener('click', function(e) {
      return Titanium.Platform.openURL("tel:" + data.annotation.phoneNumber);
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
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    });
    return this.tableView;
  }

  return shopDataDetail;

})();

module.exports = shopDataDetail;
