class shopDataDetailWindow
  constructor:(data)->

    # 引数に渡されるdataの構造は以下のとおり
    # favoriteButtonEnableは、お気に入り登録するボタンを表示するか
    # どうか決める
    # data =
    #   name:"お店の名前"
    #   shopAddress:"お店の住所"
    #   phoneNumber:"お店の電話番号"
    #   latitude:
    #   longitude:
    #   favoriteButtonEnable:true/false
    filterView = require("net.uchidak.tigfview")
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:"#f3f3f3"
      keyColor:"#DA5019"
      textColor:"#333"
      phoneColor:"#3261AB"
      favoriteColor:"#DA5019"
      feedbackColor:"#DA5019"
      separatorColor:'#cccccc'
    @MapModule = require('ti.map')    
    @mapView = @MapModule.createView
      mapType: @MapModule.NORMAL_TYPE
      region: 
        latitude:data.latitude
        longitude:data.longitude
        latitudeDelta:0.005
        longitudeDelta:0.005
      animate:true
      regionFit:true
      userLocation:true
      zIndex:0
      top:0
      left:0
      height:200
      width:'auto'

      
    @shopDataDetailWindow = Ti.UI.createWindow
      title:"近くのお店"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
    
    
    @_createNavbarElement()
    @_createMapView(data)
    @_createTableView(data)

    ActivityIndicator = require("ui/activityIndicator")
    @activityIndicator = new ActivityIndicator()
    @shopDataDetailWindow.add @activityIndicator
    
    # 詳細情報の画面に遷移する
    activeTab = Ti.API._activeTab
    return activeTab.open(@shopDataDetailWindow)
    
  _createNavbarElement:() ->
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) =>
      return @shopDataDetailWindow.close({animated:true})
    )
    
    @shopDataDetailWindow.leftNavButton = backButton
      
    shopDataDetailWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"お店の詳細情報"
      
    if Ti.Platform.osname is 'iphone'  
      @shopDataDetailWindow.setTitleControl shopDataDetailWindowTitle
      
    return
  _createMapView:(data) ->

    annotation = @MapModule.createAnnotation
      pincolor:@MapModule.ANNOTATION_PURPLE
      animate: false
      latitude:data.latitude
      longitude:data.longitude

    @mapView.addAnnotation annotation
    return @shopDataDetailWindow.add @mapView
    
  _createTableView:(data) ->
    shopData = []
    
    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      
    @addressLabel = Ti.UI.createLabel
      text:"#{data.shopAddress}"
      textAlign:'left'      
      width:280
      color:@baseColor.textColor
      left:20
      top:10
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
    
    phoneRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      rowID:1
      phoneNumber:data.phoneNumber

    @phoneIcon = Ti.UI.createButton
      top:5
      left:10
      width:30
      height:30
      backgroundColor:@baseColor.phoneColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:@baseColor.barColor
      font:
        fontSize: 24
        fontFamily:'FontAwesome'
      title:String.fromCharCode("0xf095")
      
      
      
      
    @phoneLabel = Ti.UI.createLabel
      text:"電話する"
      textAlign:'left'
      left:50
      top:10
      width:150
      color:@baseColor.textColor
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'


      
    wantToGoRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      rowID:2
      shopName:"#{data.shopName}"
      
    loveEmpty = String.fromCharCode("0xe06f")
    love = String.fromCharCode("0xe06e")

    wantToGoIcon = Ti.UI.createLabel
      top:5
      left:10
      width:30
      height:30
      backgroundColor:"#FFEE55"
      backgroundImage:"NONE"
      color:@baseColor.barColor
      font:
        fontSize:28
        fontFamily:'LigatureSymbols'
      text:love
      textAlign:'center'
    
    wantToGoIconLabel = Ti.UI.createLabel
      color:@baseColor.textColor
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
      text:"行きたい"
      textAlign:'left'
      top:5
      left:50
      width:200
      height:30
      
    feedbackLabel = Ti.UI.createLabel
      text:"お店情報の間違いを報告する"
      textAlign:'left'
      left:50
      top:10
      width:240
      color:@baseColor.textColor
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'

    feedbackRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      rowID:3
      shopName:"#{data.shopName}"

    feedbackIcon = Ti.UI.createButton
      top:5
      left:10
      width:30
      height:30
      backgroundColor:@baseColor.feedbackColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:@baseColor.barColor
      font:
        fontSize: 24
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe08a")
      
    phoneDialog = @_createPhoneDialog(data.phoneNumber,data.shopName)
    favoriteDialog = @_createFavoriteDialog(data.shopName)
    feedBackDialog = @_createFeedBackDialog(data.shopName)
    @shopDataDetailWindow.add phoneDialog
    @shopDataDetailWindow.add favoriteDialog
    @shopDataDetailWindow.add feedBackDialog

    @tableView = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:200
      left:0
      data:shopData
      backgroundColor:@baseColor.backgroundColor
      separatorColor:@baseColor.separatorColor
      borderRadius:5
      
    @tableView.addEventListener('click',(e) =>
      if e.row.rowID is 1
        @_setTiGFviewToMapView()
        @_showDialog(phoneDialog)

      else if e.row.rowID is 2
        @_setTiGFviewToMapView()
        @_showDialog(favoriteDialog)
      else if e.row.rowID is 3
        @_setTiGFviewToMapView()
        @_showDialog(feedBackDialog)
        
      else
        Ti.API.info "no action"

    )
    if typeof data.shopInfo isnt "undefined"
      shopInfoRow = Ti.UI.createTableViewRow
        width:'auto'
        height:'auto'
        selectedColor:'transparent'
        
      shopInfoIcon = Ti.UI.createLabel
        top:10
        left:10
        width:30
        height:30
        color:"#ccc"
        font:
          fontSize:24
          fontFamily:'LigatureSymbols'
        text:String.fromCharCode("0xe075")
        textAlign:'center'
        
      shopInfoLabel = Ti.UI.createLabel
        text:"#{data.shopInfo}"
        textAlign:'left'      
        width:250
        height:'auto'
        color:@baseColor.textColor
        left:50
        top:10
        font:
          fontSize:14
          fontFamily :'Rounded M+ 1p'
          
      shopInfoRow.add shopInfoLabel
      shopInfoRow.add shopInfoIcon
      
    # お気に入り一覧画面から遷移する場合などは、お気に入り登録ボタンを
    # 非表示にしたいので、favoriteButtonEnableの値をチェックする
    if data.favoriteButtonEnable is true
      # rowをタッチした際にダイアログを表示するための処理
      addressRow.add @addressLabel
      
      phoneRow.add @phoneIcon
      phoneRow.add @phoneLabel
      
      wantToGoRow.add wantToGoIconLabel
      wantToGoRow.add wantToGoIcon

      feedbackRow.add feedbackLabel
      feedbackRow.add feedbackIcon
      
      shopData.push @section  
      shopData.push addressRow
      shopData.push phoneRow
      shopData.push wantToGoRow
      shopData.push feedbackRow
      shopData.push shopInfoRow unless typeof shopInfoRow is 'undefined'
      
    else
      addressRow.add @addressLabel

      phoneRow.add @phoneIcon
      phoneRow.add @phoneLabel
      
      feedbackRow.add feedbackLabel
      feedbackRow.add feedbackIcon
      
      
      shopData.push @section  
      shopData.push addressRow
      shopData.push phoneRow
      shopData.push feedbackRow
      shopData.push shopInfoRow unless typeof shopInfoRow is 'undefined'
    @tableView.setData shopData
    return @shopDataDetailWindow.add @tableView
            
  _createFavoriteDialog:(shopName) ->
    t = Titanium.UI.create2DMatrix().scale(0.0)
    unselectedColor = "#666"
    selectedColor = "#222"
    selectedValue = false
    favoriteDialog = Ti.UI.createView
      width:300
      height:280
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:"#333"      
      zIndex:20
      transform:t
    
    titleForMemo = Ti.UI.createLabel
      text: "メモ欄"
      width:300
      height:40
      color:@baseColor.barColor
      left:10
      top:5
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      height:150
      width:280
      top:50
      left:10
      font:
        fontSize:12
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
      color:@baseColor.textColor
      textAlign:'left'
      borderWidth:2
      borderColor:"#dfdfdf"
      borderRadius:5
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT
      
    # 入力完了後、キーボードを消す  
    textArea.addEventListener('return',(e)->
      contents = e.value
      Ti.API.info "登録しようとしてるメモの内容は is #{contents}です"
      textArea.blur()
    )
    
    textArea.addEventListener('blur',(e)->
      contents = e.value
      Ti.API.info "blur event fire.content is #{contents}です"
    )  
    
    registMemoBtn = Ti.UI.createLabel
      bottom:30
      right:20
      width:120
      height:40
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"登録する"
      textAlign:'center'

    registMemoBtn.addEventListener('click',(e) =>
      that = @
      that._setDefaultMapViewStyle()
      that.activityIndicator.show()
      # ACSにメモを登録
      # 次のCloud.Places.queryからはaddNewIconの外側にある
      # 変数参照できないはずなのでここでローカル変数として格納しておく
      Ti.API.info "contents is #{contents}"
      ratings = ratings
      contents = contents
      currentUserId = Ti.App.Properties.getString "currentUserId"

      MainController = require("controller/mainController")
      mainController = new MainController()
      mainController.createReview(ratings,contents,shopName,currentUserId,(result) =>
        that.activityIndicator.hide()
        if result.success
          alert "登録しました"
        else
          alert "すでに登録されているか\nサーバーがダウンしているために登録することができませんでした"
        that._hideDialog(favoriteDialog,Ti.API.info "done")

      )
      
    ) 
    cancelleBtn =  Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:30      
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      @_setDefaultMapViewStyle()
      @_hideDialog(favoriteDialog,Ti.API.info "done")
    )
    
    favoriteDialog.add textArea
    favoriteDialog.add titleForMemo
    favoriteDialog.add registMemoBtn
    favoriteDialog.add cancelleBtn
    
    return favoriteDialog
    
  _createPhoneDialog:(phoneNumber,shopName) ->
    that = @
    t = Titanium.UI.create2DMatrix().scale(0.0)
    _view = Ti.UI.createView
      width:300
      height:240
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:@baseColor.textColor
      zIndex:20
      transform:t
      
    callBtn = Ti.UI.createLabel
      width:120
      height:40
      right:20
      bottom:40
      borderRadius:5      
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'はい'
      textAlign:"center"

    callBtn.addEventListener('click',(e) ->
      that._setDefaultMapViewStyle()
      that._hideDialog(_view,Titanium.Platform.openURL("tel:#{phoneNumber}"))

    )
    
    cancelleBtn = Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:40
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'いいえ'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) ->
      that._setDefaultMapViewStyle()
      that._hideDialog(_view,Ti.API.info "cancelleBtn hide")
      
    ) 
    confirmLabel = Ti.UI.createLabel
      top:20
      left:10
      textAlign:'center'
      width:300
      height:150
      color:@baseColor.barColor
      font:
        fontSize:16
        fontFamily:'Rounded M+ 1p'
      text:"#{shopName}の電話番号は\n#{phoneNumber}です。\n電話しますか？"
      
    _view.add confirmLabel
    _view.add cancelleBtn
    _view.add callBtn
    
    return _view

  _createFeedBackDialog:(shopName) ->
    Ti.API.info "createFeedBackDialog start shopName is #{shopName}"
    t = Titanium.UI.create2DMatrix().scale(0.0)
    unselectedColor = "#666"
    selectedColor = "#222"
    selectedValue = false
    _view = Ti.UI.createView
      width:300
      height:280
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:"#333"      
      zIndex:20
      transform:t
    
    titleForMemo = Ti.UI.createLabel
      text: "どの部分に誤りがあったのかご入力ください"
      width:300
      height:40
      color:@baseColor.barColor
      left:10
      top:5
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      height:150
      width:280
      top:50
      left:10
      font:
        fontSize:12
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
      color:@baseColor.textColor
      textAlign:'left'
      borderWidth:2
      borderColor:"#dfdfdf"
      borderRadius:5
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT
      
    # 入力完了後、キーボードを消す  
    textArea.addEventListener('return',(e)->
      contents = e.value
      Ti.API.info "登録しようとしてる情報は is #{contents}です"
      textArea.blur()
    )
    
    textArea.addEventListener('blur',(e)->
      contents = e.value
      Ti.API.info "blur event fire.content is #{contents}です"
    )  
    
    registMemoBtn = Ti.UI.createLabel
      bottom:30
      right:20
      width:120
      height:40
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"報告する"
      textAlign:'center'

    registMemoBtn.addEventListener('click',(e) =>
      that = @
      that._setDefaultMapViewStyle()
      that.activityIndicator.show()
      # ACSにメモを登録
      # 次のCloud.Places.queryからはaddNewIconの外側にある
      # 変数参照できないはずなのでここでローカル変数として格納しておく
      
      contents = contents
      currentUserId = Ti.App.Properties.getString "currentUserId"
      Ti.API.info "contents is #{contents} and shopName is #{shopName}"
      MainController = require("controller/mainController")
      mainController = new MainController()
      mainController.sendFeedBack(contents,shopName,currentUserId,(result) =>
        that.activityIndicator.hide()
        if result.success
          alert "報告完了しました"
        else
          alert "サーバーがダウンしているために登録することができませんでした"
        that._hideDialog(_view,Ti.API.info "done")

      )
      
    ) 
    cancelleBtn =  Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:30      
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      @_setDefaultMapViewStyle()
      @_hideDialog(_view,Ti.API.info "done")
    )
    
    _view.add textArea
    _view.add titleForMemo
    _view.add registMemoBtn
    _view.add cancelleBtn
    
    return _view

  # ダイアログ表示する際に、背景部分となるmapViewに対して
  # フィルタを掛けることで奥行きある状態を表現する
  _setTiGFviewToMapView:() ->
    @mapView.rasterizationScale = 0.1
    @mapView.shouldRasterize = true
    @mapView.kCAFilterTrilinear= true
    return
        
  _setDefaultMapViewStyle:() ->
    @mapView.rasterizationScale = 1.0
    @mapView.shouldRasterize =false
    @mapView.kCAFilterTrilinear= false
    return

  # 引数に取ったviewに対してせり出すようにするアニメーションを適用
  _showDialog:(_view) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(1.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return _view.animate(animation)
    
  # 引数に取ったviewに対してズームインするようなアニメーションを適用
  # することで非表示のように見せる
  _hideDialog:(_view,callback) ->        
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    _view.animate(animation)
    
    animation.addEventListener('complete',(e) ->
      return callback
    )        
module.exports = shopDataDetailWindow  
