class Command
  constructor:(obj) ->
    
    @items = obj
    @menuList = [
      description:"このアプリケーションは日本全国のクラフトビールが飲める/買えるお店を探すことが出来ます"
      screenCapture:"configurationWizard/image/logo.png"
      backCommand:null
      nextCommand:1
    ,
      description:"現在の位置から近い所のお店を探すことができます。"
      screenCapture:"configurationWizard/image/map.png"      
      backCommand:0
      nextCommand:2
    ,
      description:"飲めるお店はタンブラーのアイコン、買えるお店はボトルのアイコンで表現してます"
      screenCapture:"configurationWizard/image/iconImage.png"      
      backCommand:1
      nextCommand:3
    ,
    
      description:"リストからもお店を探すことができますので、これから出張や旅行先などでクラフトビールが飲める・買えるお店の下調べにも活用することができます"
      screenCapture:"configurationWizard/image/list.png"
      backCommand:2
      nextCommand:4
    ,
      description:"気になったお店があったら、お気に入りに登録することもできます"
      screenCapture:"configurationWizard/image/favorite.png"
      backCommand:3
      nextCommand:5
    ,
      description:"アプリケーションの説明は以上になります。Enjoy!"
      backCommand:4
      nextCommand:null
    ]
    
  moveNext:(selectedNumber) ->
    if selectedNumber is 5
      @items.currentView.add @items.endPointBtn

    @_setValue(selectedNumber)
    @_buttonShowFlg()

    return @items
    
  moveBack:(selectedNumber) ->
    if selectedNumber is 4
      @items.currentView.remove @items.endPointBtn
      
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


    @items.win.add @items.backBtn
    @items.win.add @items.nextBtn

    
    @items.currentView.add @items.label
    @items.currentView.add @items.screenCapture
    
    @items.win.add @items.currentView
    @items.win.add @items.nextView
    
    return @items.win.open()

    
  _setValue:(selectedNumber) ->
    @items.label.text = @menuList[selectedNumber].description
    @items.screenCapture.image = @menuList[selectedNumber].screenCapture
    @items.nextBtn.className = @menuList[selectedNumber].nextCommand
    @items.backBtn.className = @menuList[selectedNumber].backCommand
    
        
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