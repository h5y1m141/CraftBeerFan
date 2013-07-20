class shopDataDetail
  constructor: (data) ->
    shopData = []
    

    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'

      
    @addressLabel = Ti.UI.createLabel
      text: ""
      textAlign:'left'      
      width:280
      color:"#333"
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

    @phoneIcon = Ti.UI.createButton
      top:5
      left:10
      width:30
      height:30
      backgroundColor:"#3261AB"
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:'#fff'      
      font:
        fontSize: 24
        fontFamily:'FontAwesome'
      title:String.fromCharCode("0xf095")
      
    @phoneLabel = Ti.UI.createLabel
      text: ""
      textAlign:'left'
      left:50
      top:10
      width:150
      color:"#333"
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'



    reviewRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      
    @starIcon = Ti.UI.createButton
      top:5
      textAlign:'center'
      left:10
      width:30
      height:30
      backgroundColor:"#DA5019"
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:'#fff'      
      font:
        fontSize: 28
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe041")
      
    @starIcon.addEventListener('click',(e) ->
      modalWindow = Ti.UI.createWindow
        backgroundColor:"#f3f3f3"
        barColor:"#f9f9f9"
        
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
        color:'#333'
        font:
          fontSize:18
          fontFamily : 'Rounded M+ 1p'
          fontWeight:'bold'
        text:"お気に入り登録:#{e.source.shopName}"
        
      if Ti.Platform.osname is 'iphone'  
        modalWindow.setTitleControl _winTitle
      
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
          color:'#fff'
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
      
      label = Ti.UI.createLabel
        text: "登録したくなった理由をメモに残しておきましょう!"
        width:300
        height:40
        color:"#333"
        left:10
        top:55
        font:
          fontSize:14
          fontFamily :'Rounded M+ 1p'
          fontWeight:'bold'
      label.addEventListener('click',(e) ->
        # alert ratings
      )
      contents = ""
      shopName = e.source.shopName
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
        color:'#222',
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
        backgroundColor:"#DA5019"
        backgroundImage:"NONE"
        borderWidth:0
        borderRadius:5
        color:'#fff'
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
        Cloud.Places.query
          page: 1
          per_page: 1
          where:{name:shopName}
        , (e) ->
          if e.success
            id = e.places[0].id
            # Ti.API.info "ratings is #{ratings}"
            Ti.API.info "id is #{id}"
            Cloud.Reviews.create
              rating:ratings
              content:contents              
              place_id:id
              custom_fields:
                place_id:id
            , (e) ->
              activityIndicator.hide()
              if e.success
                alert "お気に入りに登録しました"
                modalWindow.close()
              else
                alert "すでにお気に入りに登録されているか\nサーバーがダウンしているために登録することができませんでした"
                modalWindow.close()
          else
            Ti.API.info "Error:\n"        
      )
      modalWindow.open(
        modal:true
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
      )
      
      

    )


    @editLabel = Ti.UI.createLabel
      top: 5
      left:50
      width: 200
      height: 30
      color: "#000"
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
      text: ''

    addressRow.add @addressLabel
    phoneRow.add @phoneIcon
    phoneRow.add @phoneLabel
    reviewRow.add @starIcon
    reviewRow.add @editLabel
    
    shopData.push @section  
    shopData.push addressRow
    shopData.push phoneRow
    shopData.push reviewRow

    @tableView = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:200
      left:0
      data:shopData
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      borderRadius:5
      
    return
  show: () ->
    return @tableView.show()
    
  getTable:() ->
    return @tableView
    
  setData: (data) ->

    @addressLabel.setText(data.shopAddress)

    @phoneLabel.setText("電話する")
    @phoneLabel.textAlign ='center'
    @editLabel.setFont({fontSize: 32,fontFamily: 'LigatureSymbols'})
    shopName = data.shopName
    @starIcon.shopName =  shopName
    @editLabel.setFont({fontFamily :'Rounded M+ 1p'})
    @editLabel.setText("お気に入り登録する")
    @editLabel.textAlign ='center'

    @phoneIcon.addEventListener('click',(e)->
      Titanium.Platform.openURL("tel:#{data.phoneNumber}")
    )

    
    return

      
module.exports = shopDataDetail    