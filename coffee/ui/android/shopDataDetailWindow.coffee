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
      

    @_createTableView(data)
    return @shopDataDetailWindow
    
    
    
  _createTableView:(data) ->
    shopData = []
    
    
    phoneRow = Ti.UI.createTableViewRow
      width:Ti.UI.FULL
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
      
      

    @tableView = Ti.UI.createTableView
      width:Ti.UI.FULL
      top:"300dp"
      left:0
      data:shopData
      backgroundColor:@baseColor.backgroundColor
      separatorColor:@baseColor.separatorColor
      borderRadius:5
      
    @tableView.addEventListener('click',(e) =>

    )
    if typeof data.shopInfo isnt "undefined"
      shopInfoRow = Ti.UI.createTableViewRow
        width:'auto'
        height:'auto'
        selectedColor:'transparent'
        
      shopInfoIcon = Ti.UI.createLabel
        top:10
        left:10
        width:"40dip"
        height:"40dip"
        color:"#ccc"
        font:
          fontSize:"36dip"
          fontFamily:'LigatureSymbols'
        text:String.fromCharCode("0xe075")
        textAlign:'center'
        
      shopInfoLabel = Ti.UI.createLabel
        text:"#{data.shopInfo}"
        textAlign:'left'      
        width:"250dip"
        height:'auto'
        color:@baseColor.textColor
        left:100
        top:10
        font:
          fontSize:"18dip"
          fontWeight:'bold'          
          
      shopInfoRow.add shopInfoLabel
      shopInfoRow.add shopInfoIcon
      
      shopData.push @section  
      shopData.push shopInfoRow unless typeof shopInfoRow is 'undefined'
      
    @tableView.setData shopData
    return @shopDataDetailWindow.add @tableView
            
        
module.exports = shopDataDetailWindow  
