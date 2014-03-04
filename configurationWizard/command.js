(function() {
  var Command;

  Command = (function() {
    function Command(obj) {
      this.items = obj;
      this.menuList = [
        {
          description: "このアプリケーションは日本全国のクラフトビールが飲める/買えるお店を探すことが出来ます",
          screenCapture: "configurationWizard/image/logo.png",
          backCommand: null,
          nextCommand: 1
        }, {
          description: "現在の位置から近い所のお店を探すことができます。",
          screenCapture: "configurationWizard/image/map.png",
          backCommand: 0,
          nextCommand: 2
        }, {
          description: "飲めるお店はタンブラーのアイコン、買えるお店はボトルのアイコンで表現してます",
          screenCapture: "configurationWizard/image/iconImage.png",
          backCommand: 1,
          nextCommand: 3
        }, {
          description: "リストからもお店を探すことができますので、これから出張や旅行先などでクラフトビールが飲める・買えるお店の下調べにも活用することができます",
          screenCapture: "configurationWizard/image/list.png",
          backCommand: 2,
          nextCommand: 4
        }, {
          description: "気になったお店があったら、お気に入りに登録することもできます",
          screenCapture: "configurationWizard/image/favorite.png",
          backCommand: 3,
          nextCommand: 5
        }, {
          description: "アプリケーションの説明は以上になります。Enjoy!",
          backCommand: 4,
          nextCommand: null
        }
      ];
    }

    Command.prototype.moveNext = function(selectedNumber) {
      if (selectedNumber === 5) {
        this.items.currentView.add(this.items.endPointBtn);
      }
      this._setValue(selectedNumber);
      this._buttonShowFlg();
      return this.items;
    };

    Command.prototype.moveBack = function(selectedNumber) {
      if (selectedNumber === 4) {
        this.items.currentView.remove(this.items.endPointBtn);
      }
      this._setValue(selectedNumber);
      this._buttonShowFlg();
      return this.items;
    };

    Command.prototype.execute = function(selectedNumber) {
      this._setValue(selectedNumber);
      this._buttonShowFlg();
      this.items.nextBtn.addEventListener('click', (function(_this) {
        return function(e) {
          if (e.source.className !== null) {
            return _this.moveNext(e.source.className);
          }
        };
      })(this));
      this.items.backBtn.addEventListener('click', (function(_this) {
        return function(e) {
          if (e.source.className !== null) {
            return _this.moveBack(e.source.className);
          }
        };
      })(this));
      this.items.win.add(this.items.backBtn);
      this.items.win.add(this.items.nextBtn);
      this.items.currentView.add(this.items.label);
      this.items.currentView.add(this.items.screenCapture);
      this.items.win.add(this.items.currentView);
      this.items.win.add(this.items.nextView);
      return this.items.win.open();
    };

    Command.prototype._setValue = function(selectedNumber) {
      this.items.label.text = this.menuList[selectedNumber].description;
      this.items.screenCapture.image = this.menuList[selectedNumber].screenCapture;
      this.items.nextBtn.className = this.menuList[selectedNumber].nextCommand;
      this.items.backBtn.className = this.menuList[selectedNumber].backCommand;
      return true;
    };

    Command.prototype._buttonShowFlg = function() {
      if (this.items.nextBtn.className === null) {
        this.items.nextBtn.hide();
      } else {
        this.items.nextBtn.show();
      }
      if (this.items.backBtn.className === null) {
        return this.items.backBtn.hide();
      } else {
        return this.items.backBtn.show();
      }
    };

    return Command;

  })();

  module.exports = Command;

}).call(this);
