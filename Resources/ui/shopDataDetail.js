var shopDataDetail;

shopDataDetail = (function() {

  function shopDataDetail(data) {
    var addressRow, phoneRow, shopData;
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
    this.phoneLabel = Ti.UI.createLabel({
      text: "",
      left: 20,
      top: 10,
      width: 150,
      color: "#333",
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
    Cloud.Reviews.query({
      page: 1,
      per_page: 20,
      place_id: "51cb8b0377b5c90acd0a0bb2"
    }, function(e) {
      var i, review, _results;
      if (e.success) {
        i = 0;
        _results = [];
        while (i < e.reviews.length) {
          review = e.reviews[i];
          Ti.API.info("id: " + review.id + "\n" + "id: " + review.id + "\n" + "rating: " + review.rating + "\n" + "content: " + review.content + "\n" + "updated_at: " + review.updated_at);
          _results.push(i++);
        }
        return _results;
      } else {
        return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
      }
    });
    addressRow.add(this.addressLabel);
    phoneRow.add(this.phoneLabel);
    phoneRow.add(this.callBtn);
    shopData.push(this.section);
    shopData.push(addressRow);
    shopData.push(phoneRow);
    this.tableView = Ti.UI.createTableView({
      width: 'auto',
      height: 80,
      top: 10,
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
    this.addressLabel.setText(data.shopAddress);
    this.phoneLabel.setText(data.phoneNumber);
    this.callBtn.addEventListener('click', function(e) {
      return Titanium.Platform.openURL("tel:" + data.annotation.phoneNumber);
    });
  };

  return shopDataDetail;

})();

module.exports = shopDataDetail;
