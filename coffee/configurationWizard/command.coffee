class Command
  constructor:(obj) ->
    
    @items = obj
    @menuList = [
      description:"ようこそ"
      backCommand:null
      nextCommand:1
    ,
      description:"この画面では基本的な操作方法について解説します"
      backCommand:0
      nextCommand:2
    ,
      description:"応用編について解説します"
      backCommand:1
      nextCommand:3
    ,
      description:"更に踏み込んだTIPSについて解説します"
      backCommand:2
      nextCommand:4
    ,
      description:"アプリ起動します"
      backCommand:3
      nextCommand:null
    ]
    
  moveNext:(selectedNumber) ->
    @_setValue(selectedNumber)
    @_buttonShowFlg()

    return @items
    
  moveBack:(selectedNumber) ->
    @_setValue(selectedNumber)
    @_buttonShowFlg()
    
    return @items
    
  execute:(selectedNumber) ->
    @_setValue(selectedNumber)
    @_buttonShowFlg()


    @items.nextBtn.addEventListener('click',(e) =>
      if e.source.className isnt null
        @moveNext(e.source.className)
    )      

    @items.backBtn.addEventListener('click',(e) =>
      if e.source.className isnt null
        @moveBack(e.source.className)
    )


    @items.win.add @items.backBtn # unless @items.backBtn.className is null
    @items.win.add @items.nextBtn # unless @items.nextBtn.className is null

    
    @items.currentView.add @items.label
    
    @items.win.add @items.currentView
    @items.win.add @items.nextView
    
    return @items.win.open()

    
  _setValue:(selectedNumber) ->
    @items.label.text = @menuList[selectedNumber].description
        
    @items.nextBtn.className = @menuList[selectedNumber].nextCommand
    @items.backBtn.className = @menuList[selectedNumber].backCommand
    
    if @menuList[selectedNumber].backCommand is 3
      @items.currentView.add @items.endPointBtn
      
    return true
    
  _buttonShowFlg:() ->
    
    if @items.nextBtn.className is null
      @items.nextBtn.hide()
    else 
      @items.nextBtn.show()
      
    if @items.backBtn.className is null
      @items.backBtn.hide()

    else 
      @items.backBtn.show()

module.exports = Command