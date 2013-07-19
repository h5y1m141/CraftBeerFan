var Command;

Command = (function() {

  function Command(obj) {
    this.items = obj;
    this.menuList = [
      {
        description: "ようこそ",
        backCommand: null,
        nextCommand: 1
      }, {
        description: "この画面では基本的な操作方法について解説します",
        backCommand: 0,
        nextCommand: 2
      }, {
        description: "応用編について解説します",
        backCommand: 1,
        nextCommand: 3
      }, {
        description: "更に踏み込んだTIPSについて解説します",
        backCommand: 2,
        nextCommand: 4
      }, {
        description: "アプリ起動します",
        backCommand: 3,
        nextCommand: null
      }
    ];
  }

  Command.prototype.moveNext = function(selectedNumber) {
    this._setValue(selectedNumber);
    this._buttonShowFlg();
    return this.items;
  };

  Command.prototype.moveBack = function(selectedNumber) {
    this._setValue(selectedNumber);
    this._buttonShowFlg();
    return this.items;
  };

  Command.prototype.execute = function(selectedNumber) {
    var _this = this;
    this._setValue(selectedNumber);
    this._buttonShowFlg();
    this.items.nextBtn.addEventListener('click', function(e) {
      if (e.source.className !== null) {
        return _this.moveNext(e.source.className);
      }
    });
    this.items.backBtn.addEventListener('click', function(e) {
      if (e.source.className !== null) {
        return _this.moveBack(e.source.className);
      }
    });
    this.items.win.add(this.items.backBtn);
    this.items.win.add(this.items.nextBtn);
    this.items.currentView.add(this.items.label);
    this.items.win.add(this.items.currentView);
    this.items.win.add(this.items.nextView);
    return this.items.win.open();
  };

  Command.prototype._setValue = function(selectedNumber) {
    this.items.label.text = this.menuList[selectedNumber].description;
    this.items.nextBtn.className = this.menuList[selectedNumber].nextCommand;
    this.items.backBtn.className = this.menuList[selectedNumber].backCommand;
    if (this.menuList[selectedNumber].backCommand === 3) {
      this.items.currentView.add(this.items.endPointBtn);
    }
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
