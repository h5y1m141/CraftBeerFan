class mainTab
  constructor:() ->
    MapWindow = require("ui/mapWindow")
    @mapWindow = new MapWindow()
    
    MypageWindow = require("ui/mypageWindow")
    @mypageWindow = new MypageWindow()
    
    ListWindow = require("ui/listWindow")
    @listWindow = new ListWindow()
    
    FavoriteWindow = require("ui/favoriteWindow")
    @favoriteWindow = new FavoriteWindow()
    
    itemList = [
      "name":"近くから探す"
      "imageCharCode":"0xe103"
      "backgroundColor":"#3261AB"
      "windowName":"mapWindow"
    ,
      "name":"リストから探す"
      "imageCharCode":"0xe084"
      "backgroundColor":"#007FB1"
      "windowName":"listWindow"      
    ,
      "name":"お気に入りから探す"
      "imageCharCode":"0xe041"
      "backgroundColor":"#DA5019"
      "windowName":"favoriteWindow"      
    ,
      "name":"マイページ"
      "imageCharCode":"0xe137"
      "backgroundColor":"#23AC0E"
      "windowName":"mypageWindow"      
    ]
    
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#EDAD0B"
     
    @table = Ti.UI.createTableView
      backgroundColor:@baseColor.backgroundColor
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:'auto'
      height:'auto'
      left:0
      top:10
    @table.addEventListener('click',(e)=>
      if e.row.className is "menu"
        Ti.API.info @[e.row.windowName]
        activeTab = Ti.API._activeTab
        activeTab.open @[e.row.windowName]
    )

    section = @_createSection()
    items = []
    for item in itemList
      menu = @_createMenu(item)
      section.add menu
      
    items.push(section)

    @table.setData items

    mainWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"main"
                  
    mainWindow = Ti.UI.createWindow
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.barColor
      tabBarHidden:true
      navBarHidden:false
      
    if Ti.Platform.osname is 'iphone'  
      mainWindow.setTitleControl mainWindowTitle
      
    mainWindow.add @table        
    mainTab = Ti.UI.createTab
      window:mainWindow
    
    return mainTab

  _createSection:() ->
    menuHeaderView = Ti.UI.createView
      backgroundColor:@baseColor.backgroundColor
      height:30
      
    menuHeaderTitle = Ti.UI.createLabel
      top:0
      left:5
      color:'#333'
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'メニュー'
      
    menuHeaderView.add menuHeaderTitle
    
    menuSection = Ti.UI.createTableViewSection
      headerView:menuHeaderView
      
    return menuSection
    
  _createMenu:(item) ->

    menuRow = Ti.UI.createTableViewRow
      backgroundColor:@baseColor.backgroundColor
      height:60
      hasChild:true      
      className:"menu"
      windowName:item.windowName
      
    menuLabel = Ti.UI.createLabel
      text: "#{item.name}"
      width:200
      color:"#333"
      left:60
      top:10
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    icon = Ti.UI.createButton
      top:10
      left:10
      width:40
      height:40
      backgroundColor:item.backgroundColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:'#fff'      
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode(item.imageCharCode)
        
    menuRow.add menuLabel
    menuRow.add icon
    return menuRow
    
module.exports = mainTab  