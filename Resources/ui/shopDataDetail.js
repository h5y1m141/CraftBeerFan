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
        fontSize: 24,
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
    this.starIcon = Ti.UI.createButton({
      top: 5,
      left: 10,
      width: 30,
      height: 30,
      backgroundColor: "#DA5019",
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 0,
      color: '#fff',
      font: {
        fontSize: 28,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode("0xe041")
    });
    this.starIcon.addEventListener('click', function(e) {
      var ActivityIndicator, activityIndicator, addNewIcon, closeButton, contents, disableColor, enableColor, i, label, leftPostion, modalWindow, ratings, shopName, starIcon, textArea, _i, _winTitle;
      modalWindow = Ti.UI.createWindow({
        backgroundColor: "#f3f3f3",
        barColor: "#f9f9f9"
      });
      closeButton = Titanium.UI.createButton({
        backgroundImage: "ui/image/backButton.png",
        width: 44,
        height: 44
      });
      closeButton.addEventListener('click', function(e) {
        return modalWindow.close({
          animated: true
        });
      });
      ActivityIndicator = require("ui/activityIndicator");
      activityIndicator = new ActivityIndicator();
      modalWindow.leftNavButton = closeButton;
      modalWindow.add(activityIndicator);
      _winTitle = Ti.UI.createLabel({
        textAlign: 'center',
        color: '#333',
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "お気に入り登録:" + e.source.shopName
      });
      if (Ti.Platform.osname === 'iphone') {
        modalWindow.setTitleControl(_winTitle);
      }
      enableColor = "#FFE600";
      disableColor = "#FFFBD5";
      ratings = 0;
      leftPostion = [5, 45, 85, 125, 165];
      for (i = _i = 0; _i <= 4; i = ++_i) {
        starIcon = Ti.UI.createButton({
          top: 5,
          left: leftPostion[i],
          width: 30,
          height: 30,
          selected: false,
          backgroundColor: disableColor,
          backgroundImage: "NONE",
          borderWidth: 0,
          borderRadius: 5,
          color: '#fff',
          font: {
            fontSize: 24,
            fontFamily: 'LigatureSymbols'
          },
          title: String.fromCharCode("0xe121")
        });
        starIcon.addEventListener('click', function(e) {
          if (e.source.selected === false) {
            e.source.backgroundColor = enableColor;
            e.source.selected = true;
            return ratings++;
          } else {
            e.source.backgroundColor = disableColor;
            e.source.selected = false;
            return ratings--;
          }
        });
        modalWindow.add(starIcon);
      }
      label = Ti.UI.createLabel({
        text: "登録したくなった理由をメモに残しておきましょう!",
        width: 300,
        height: 40,
        color: "#333",
        left: 10,
        top: 55,
        font: {
          fontSize: 14,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      label.addEventListener('click', function(e) {});
      contents = "";
      shopName = e.source.shopName;
      textArea = Titanium.UI.createTextArea({
        value: '',
        height: 150,
        width: 300,
        top: 100,
        left: 5,
        font: {
          fontSize: 12,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        color: '#222',
        textAlign: 'left',
        borderWidth: 2,
        borderColor: "#dfdfdf",
        borderRadius: 5,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT
      });
      textArea.addEventListener('return', function(e) {
        contents = e.value;
        Ti.API.info("e.value is " + e.value);
        return textArea.blur();
      });
      addNewIcon = Ti.UI.createButton({
        top: 270,
        left: 110,
        width: 100,
        height: 40,
        backgroundColor: "#DA5019",
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 5,
        color: '#fff',
        font: {
          fontSize: 32,
          fontFamily: 'LigatureSymbols'
        },
        title: String.fromCharCode("0xe041")
      });
      modalWindow.add(addNewIcon);
      modalWindow.add(textArea);
      modalWindow.add(label);
      addNewIcon.addEventListener('click', function(e) {
        activityIndicator.show();
        Ti.API.info("contents is " + contents);
        ratings = ratings;
        contents = contents;
        return Cloud.Places.query({
          page: 1,
          per_page: 1,
          where: {
            name: shopName
          }
        }, function(e) {
          var id;
          if (e.success) {
            id = e.places[0].id;
            Ti.API.info("id is " + id);
            return Cloud.Reviews.create({
              rating: ratings,
              content: contents,
              place_id: id,
              custom_fields: {
                place_id: id
              }
            }, function(e) {
              activityIndicator.hide();
              if (e.success) {
                return alert("お気に入りに登録しました");
              } else {
                alert(e);
                return alert("すでにお気に入りに登録されているか\nサーバーがダウンしているために登録することができませんでした");
              }
            });
          } else {
            return Ti.API.info("Error:\n");
          }
        });
      });
      return modalWindow.open({
        modal: true,
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
        modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
      });
    });
    this.editLabel = Ti.UI.createLabel({
      top: 5,
      left: 50,
      width: 200,
      height: 30,
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
    reviewRow.add(this.starIcon);
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
    this.starIcon.shopName = shopName;
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
