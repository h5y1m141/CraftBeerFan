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

    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:"#f3f3f3"
      keyColor:"#DA5019"
      textColor:"#333"
      phoneColor:"#3261AB"
      favoriteColor:"#DA5019"
      starColor:"#DA5019"
      separatorColor:'#cccccc'

      
    @shopDataDetailWindow = Ti.UI.createWindow
      title:"#{data.shopName}"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      
    detailMap = Titanium.Map.createView
      mapType:Titanium.Map.STANDARD_TYPE
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
      height:'400dip'
      width:Ti.UI.FULL
      
    annotation = Titanium.Map.createAnnotation
      pincolor:Titanium.Map.ANNOTATION_PURPLE
      animate: false
      latitude:data.latitude
      longitude:data.longitude

    detailMap.addAnnotation annotation
    @shopDataDetailWindow.add detailMap

    @_createTableView(data)

    ActivityIndicator = require("ui/activityIndicator")
    @activityIndicator = new ActivityIndicator()
    @shopDataDetailWindow.add @activityIndicator
    return @shopDataDetailWindow
    
    
    
  _createTableView:(data) ->
    shopData = []
    
    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:'40dip'
      selectedColor:'transparent'
      
    @addressLabel = Ti.UI.createLabel
      text:"#{data.shopAddress}"
      textAlign:'left'      
      width:'280dip'
      color:@baseColor.textColor
      left:20
      top:10
      font:
        fontSize:'18dip'
        fontWeight:'bold'
    
    phoneRow = Ti.UI.createTableViewRow
      width:'auto'
      height:'40dip'
      selectedColor:'transparent'
      rowID:1
      phoneNumber:data.phoneNumber

    @phoneIcon = Ti.UI.createButton
      top:5
      left:10
      width:'40dip'
      height:'40dip'
      backgroundColor:@baseColor.phoneColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:@baseColor.barColor
      font:
        fontSize:'36dip'
        fontFamily:'fontawesome-webfont'
      title:String.fromCharCode("0xf095")
      
      
    @phoneLabel = Ti.UI.createLabel
      text:"電話する"
      textAlign:'left'
      left:100
      top:10
      width:'150dip'
      color:@baseColor.textColor
      font:
        fontSize:'18dip'
        fontWeight:'bold'


      
    wantToGoRow = Ti.UI.createTableViewRow
      width:'auto'
      height:'40dip'
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
      text:"行きたい"
      textAlign:'left'
      top:5
      left:50
      width:200
      height:30
      
    phoneDialog = @_createPhoneDialog(data.phoneNumber,data.shopName)
    favoriteDialog = @_createFavoriteDialog(data.shopName)
    @shopDataDetailWindow.add phoneDialog
    @shopDataDetailWindow.add favoriteDialog

    @tableView = Ti.UI.createTableView
      width:Ti.UI.FULL
      top:400
      left:0
      data:shopData
      backgroundColor:@baseColor.backgroundColor
      separatorColor:@baseColor.separatorColor
      borderRadius:5
      
    @tableView.addEventListener('click',(e) =>
      if e.row.rowID is 1
        @_showDialog(phoneDialog)

      else if e.row.rowID is 2
        @_showDialog(favoriteDialog)
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
      
      shopData.push @section  
      shopData.push addressRow
      shopData.push phoneRow
      shopData.push wantToGoRow
      shopData.push shopInfoRow unless typeof shopInfoRow is 'undefined'
      
    else
      addressRow.add @addressLabel

      phoneRow.add @phoneIcon
      phoneRow.add @phoneLabel
      
      shopData.push @section  
      shopData.push addressRow
      shopData.push phoneRow
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
        fontSize:'14dip'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      height:150
      width:280
      top:50
      left:10
      font:
        fontSize:'12dip'
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
        fontSize:'18dip'
      text:"登録する"
      textAlign:'center'

    registMemoBtn.addEventListener('click',(e) =>
      that = @
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
        fontSize:'18dip'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
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
      width:Ti.UI.FULL
      height:'240dip'
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:@baseColor.textColor
      zIndex:20
      transform:t
      
    callBtn = Ti.UI.createLabel
      width:'120dip'
      height:'40dip'
      right:20
      bottom:40
      borderRadius:5      
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:'18dip'
      text:'はい'
      textAlign:"center"

    callBtn.addEventListener('click',(e) ->
      that._hideDialog(_view,Titanium.Platform.openURL("tel:#{phoneNumber}"))

    )
    
    cancelleBtn = Ti.UI.createLabel
      width:'120dip'
      height:'40dip'
      left:20
      bottom:40
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:'18dip'
      text:'いいえ'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) ->
      that._hideDialog(_view,Ti.API.info "cancelleBtn hide")
      
    ) 
    confirmLabel = Ti.UI.createLabel
      top:20
      left:10
      textAlign:'center'
      width:'300dip'
      height:'150dip'
      color:@baseColor.barColor
      font:
        fontSize:'16dip'
      text:"#{shopName}の電話番号は\n#{phoneNumber}です。\n電話しますか？"
      
    _view.add confirmLabel
    _view.add cancelleBtn
    _view.add callBtn
    
    return _view



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