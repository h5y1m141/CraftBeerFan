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
      starColor:"#DA5019"
      separatorColor:'#cccccc'

      
    @shopDataDetailWindow = Ti.UI.createWindow
      title:"近くのお店"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
    @_createNavbarElement()
    @_createMapView(data)
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



    @reviewRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      rowID:2
      shopName:"#{data.shopName}"
      
    starIcon = Ti.UI.createButton
      top:5
      textAlign:'center'
      left:10
      width:30
      height:30
      backgroundColor:@baseColor.starColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:@baseColor.barColor
      font:
        fontSize: 28
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe041")
      
    @editLabel = Ti.UI.createLabel
      top: 5
      left:50
      width: 200
      height: 30
      color:@baseColor.textColor
      font:
        fontSize:16
        fontFamily:'Rounded M+ 1p'
      text:"お気に入り登録する"
      textAlign:'left'


    @tableView = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:200
      left:0
      data:shopData
      backgroundColor:@baseColor.backgroundColor
      separatorColor:@baseColor.separatorColor
      borderRadius:5
      
    # お気に入り一覧画面から遷移する場合などは、お気に入り登録ボタンを
    # 非表示にしたいので、favoriteButtonEnableの値をチェックする
    if data.favoriteButtonEnable is true
      @tableView.addEventListener('click',(e) =>
        if e.row.rowID is 2
          shopName = e.row.shopName
          @_createModalWindow(shopName)
        else if e.row.rowID is 1
          phoneDialog = @_createPhoneDialog(e.row.phoneNumber)
          
          # Titanium.Platform.openURL("tel:#{e.row.phoneNumber}")
      # t1 = Titanium.UI.create2DMatrix()
      # t1 = t1.scale(1.0)
      # animation = Titanium.UI.createAnimation()
      # animation.transform = t1
      # animation.duration = 250
      # accountSignUpView.animate(animation)

      )
      
      addressRow.add @addressLabel
      
      phoneRow.add @phoneIcon
      phoneRow.add @phoneLabel
      
      @reviewRow.add starIcon
      @reviewRow.add @editLabel
      
      shopData.push @section  
      shopData.push addressRow
      shopData.push phoneRow
      shopData.push @reviewRow

      
      
    else
      @tableView.addEventListener('click',(e) =>
        if e.row.rowID is 1
          Titanium.Platform.openURL("tel:#{data.phoneNumber}")  
      )
    
      addressRow.add @addressLabel
      
      phoneRow.add @phoneIcon
      phoneRow.add @phoneLabel
      
      shopData.push @section  
      shopData.push addressRow
      shopData.push phoneRow

    @tableView.setData shopData
    @shopDataDetailWindow.add @tableView

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
    mapView = Titanium.Map.createView
      mapType: Titanium.Map.STANDARD_TYPE
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

    annotation = Titanium.Map.createAnnotation
      pincolor:Titanium.Map.ANNOTATION_PURPLE
      animate: false
      latitude:data.latitude
      longitude:data.longitude

    mapView.addAnnotation annotation
    return @shopDataDetailWindow.add mapView
  _createModalWindow:(shopName) ->
    modalWindow = Ti.UI.createWindow
      backgroundColor:@baseColor.backgroundColor
      barColor:@baseColor.barColor
      
    closeButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
      
    closeButton.addEventListener('click',(e) ->
      return modalWindow.close({animated:true})
    )
    ActivityIndicator = require("ui/activityIndicator")
    activityIndicator = new ActivityIndicator()
    modalWindow.leftNavButton = closeButton
    modalWindow.add activityIndicator
    
    _winTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:@baseColor.textColor
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"お気に入り登録:#{shopName}"
      
    if Ti.Platform.osname is 'iphone'  
      modalWindow.setTitleControl _winTitle
      
    @_createStarIcon(modalWindow)
    
    label = Ti.UI.createLabel
      text: "登録したくなった理由をメモに残しておきましょう!"
      width:300
      height:40
      color:@baseColor.textColor
      left:10
      top:55
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      height:150
      width:300
      top:100
      left:5
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
      Ti.API.info "e.value is #{e.value}"
      textArea.blur()
    )  
    addNewIcon = Ti.UI.createButton
      top:270
      left:110
      width:100
      height:40
      backgroundColor:@baseColor.starColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.barColor
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe041")

      
    modalWindow.add addNewIcon
    modalWindow.add textArea
    modalWindow.add label
    addNewIcon.addEventListener('click',(e)->
      activityIndicator.show()
      # 次のCloud.Places.queryからはaddNewIconの外側にある
      # 変数参照できないはずなのでここでローカル変数として格納しておく
      Ti.API.info "contents is #{contents}"
      ratings = ratings
      contents = contents
      currentUserId = Ti.App.Properties.getString "currentUserId"

      MainController = require("controller/mainController")
      mainController = new MainController()
      mainController.createReview(ratings,contents,shopName,currentUserId,(result) ->
        activityIndicator.hide()
        if result.success
          alert "お気に入りに登録しました"
        else
          alert "すでにお気に入りに登録されているか\nサーバーがダウンしているために登録することができませんでした"
          
        modalWindow.close()
      )
    )
    modalWindow.open(
      modal:true
      modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
      modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    )
    
  _createStarIcon:(modalWindow) ->
    # ratingsを１から５までで管理できるので星印を使って表現
    # 選択されていない状態を意図するのがdisableColorとする
    enableColor  = "#FFE600"
    disableColor = "#FFFBD5"
    ratings = 0
    leftPostion = [5, 45, 85, 125, 165]
    for i in [0..4]

      starIcon = Ti.UI.createButton
        top:5
        left:leftPostion[i]
        width:30
        height:30
        selected:false
        backgroundColor:disableColor
        backgroundImage:"NONE"
        borderWidth:0
        borderRadius:5
        color:@baseColor.barColor
        font:
          fontSize: 24
          fontFamily:'LigatureSymbols'
        title:String.fromCharCode("0xe121")
        
      starIcon.addEventListener('click',(e) ->
        if e.source.selected is false
          e.source.backgroundColor = enableColor
          e.source.selected = true
          ratings++
        else
          e.source.backgroundColor = disableColor
          e.source.selected = false
          ratings--            
      )  
      modalWindow.add starIcon
    return
    
  _createPhoneDialog:(phoneNumber) ->
    phoneDialog = Ti.UI.createView
      width:240
      height:240
      top:100      
      left:30
      backgroundColor:@baseColor.barColor
      zIndex:0
      t = Titanium.UI.create2DMatrix().scale(0.0)
      
    confirmLabel = Ti.UI.createLabel
      top:5
      left:5
      textAlign:'left'
      width:220
      height:20
      color:@baseColor.textColor
      font:
        fontSize:14
        fontFamily:'Rounded M+ 1p'
      text:"#{phoneNumber}に電話しますか？"
      
    phoneDialog.add confirmLabel
    
    return phoneDialog
module.exports = shopDataDetailWindow  