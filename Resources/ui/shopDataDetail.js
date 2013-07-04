var shopDataDetail;

shopDataDetail = (function() {

  function shopDataDetail(data) {
    var addressRow, phoneRow, reviewRow, shopData;
    shopData = [];
    addressRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40,
      selectedColor: 'transparent'
    });
    this.addressLabel = Ti.UI.createLabel({
      text: "",
      width: 280,
      color: "#333",
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
    this.phoneIcon = Ti.UI.createButton({
      top: 5,
      left: 10,
      width: 30,
      height: 30,
      backgroundColor: "#3261AB",
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 0,
      color: '#fff',
      font: {
        fontSize: 32,
        fontFamily: 'FontAwesome'
      },
      title: String.fromCharCode("0xf095")
    });
    this.phoneLabel = Ti.UI.createLabel({
      text: "",
      left: 50,
      top: 10,
      width: 150,
      color: "#333",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    reviewRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40,
      selectedColor: 'transparent'
    });
    this.memoIcon = Ti.UI.createButton({
      top: 5,
      left: 10,
      width: 30,
      height: 30,
      backgroundColor: "#3261AB",
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 0,
      color: '#fff',
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode("0xe08d")
    });
    this.memoIcon.addEventListener('click', function(e) {
      cbFan.activityIndicator.show();
      return Cloud.Places.query({
        page: 1,
        per_page: 1,
        where: {
          name: e.source.shopName
        }
      }, function(e) {
        var id;
        if (e.success) {
          id = e.places[0].id;
          return Cloud.Reviews.create({
            rating: 1,
            place_id: id,
            custom_fields: {
              place_id: id
            }
          }, function(e) {
            cbFan.activityIndicator.hide();
            if (e.success) {
              return alert("お気に入りに登録しました");
            } else {
              return alert("お気に入りに登録することができませんでした");
            }
          });
        } else {
          return Ti.API.info("Error:\n");
        }
      });
    });
    this.editLabel = Ti.UI.createLabel({
      top: 5,
      left: 10,
      width: Ti.UI.SIZE,
      height: Ti.UI.SIZE,
      color: "#000",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: ''
    });
    addressRow.add(this.addressLabel);
    phoneRow.add(this.phoneIcon);
    phoneRow.add(this.phoneLabel);
    reviewRow.add(this.memoIcon);
    reviewRow.add(this.editLabel);
    shopData.push(this.section);
    shopData.push(addressRow);
    shopData.push(phoneRow);
    shopData.push(reviewRow);
    this.tableView = Ti.UI.createTableView({
      width: 'auto',
      height: 'auto',
      top: 200,
      left: 0,
      data: shopData,
      backgroundColor: "#f3f3f3",
      separatorColor: '#cccccc',
      borderRadius: 5
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
    var shopName;
    this.addressLabel.setText(data.shopAddress);
    this.phoneLabel.setText("電話する");
    this.editLabel.setFont({
      fontSize: 32,
      fontFamily: 'LigatureSymbols'
    });
    shopName = data.name;
    this.memoIcon.shopName = shopName;
    this.editLabel.setFont({
      fontFamily: 'Rounded M+ 1p'
    });
    this.editLabel.setText("お気に入り登録する");
    this.phoneIcon.addEventListener('click', function(e) {
      alert("phone icon touch");
      return Titanium.Platform.openURL("tel:" + data.phoneNumber);
    });
  };

  return shopDataDetail;

})();

module.exports = shopDataDetail;
