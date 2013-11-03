class listWindow
  constructor:() ->
    ActivityIndicator = require("ui/activityIndicator")
    @activityIndicator = new ActivityIndicator()
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#EDAD0B"
      
    @listWindow = Ti.UI.createWindow
      title:"リスト"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:false
      navBarHidden:false
      
    @_createNavbarElement()

    t = Titanium.UI.create2DMatrix().scale(0)
    
    @table = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
      width:160
      height:'auto'
      left:150
      top:20
      borderColor:"#f3f3f3"
      borderWidth:2
      borderRadius:10
      zIndex:10
      transform:t

    @table.addEventListener('click',(e) =>
      that = @
      that.activityIndicator.show()
      prefectureName = e.row.prefectureName
      KloudService = require("model/kloudService")
      kloudService = new KloudService()
      kloudService.findShopDataBy(prefectureName,(items) ->
        that.activityIndicator.hide()
        if items.length is 0
          alert "選択した地域のお店がみつかりません"
        else
          Ti.API.info "kloudService success"
          items.sort( (a, b) ->
            (if a.shopAddress > b.shopAddress then -1 else 1)
          )
          ShopAreaDataWindow = require("ui/iphone/shopAreaDataWindow") 
          new ShopAreaDataWindow(items)
      )
      
    ) # end of tableView Event
        
    @prefectures = @_loadPrefectures()
    @rowHeight =  50
    @subMenu = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:"auto"
      height:"auto"
      left:0
      top:0
      zIndex:1
      
    @prefectureColorSet = "name":
      "北海道・東北":"#3261AB"
      "関東":"#007FB1"
      "中部":"#23AC0E"
      "近畿":"#FFE600"
      "中国・四国":"#F6CA06"
      "九州・沖縄":"#DA5019"
      
    @prefectureSubColorSet = "name":  
      "北海道・東北":"#D5E0F1"
      "関東":"#CAE7F2"
      "中部":"#D1F1CC"
      "近畿":"#FFFBD5"
      "中国・四国":"#FEF7D5"
      "九州・沖縄":"#F9DFD5"
      
    
    @subMenu.addEventListener('click',(e)=>
      categoryName = e.row.categoryName
      that = @
      if categoryName is "行きたいお店"
        FavoriteWindow = require("ui/iphone/favoriteWindow")
        new FavoriteWindow()
        
      else
        selectedColor = @prefectureColorSet.name[categoryName]
        # selectedSubColor = @prefectureSubColorSet.name[categoryName]
        selectedSubColor = "#FFF"
        curretRowIndex　= e.index
        # animateした後のコールバック関数内では@が
        # 参照できないために以下変数に格納する
        table = @table
        t1 = Titanium.UI.create2DMatrix().scale(0.0)
        a = Titanium.UI.createAnimation()
        a.transform = t1
        a.duration = 400
        a.addEventListener('complete',() ->
          t2 = Titanium.UI.create2DMatrix()
          table.animate
            transform:t2
            duration:400
        )  
        table.animate(a,()->
          that.refreshTableData(categoryName,selectedColor,selectedSubColor)
        )

    )

    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    subMenuRows = []

    for categoryName of PrefectureCategory
      row = @_createSubMenuRow("#{categoryName}")
      subMenuRows.push row

    # アカウント登録をスキップして利用する人がいるため、
    # currentUserIdの値をチェックして、存在しない場合にはお気に入り
    # rowを配置しない
    currentUserId  =Ti.App.Properties.getString "currentUserId"
    Ti.API.info "check if favoriteRow should be created. currentUserId is #{currentUserId}"
    
    if typeof currentUserId is "undefined" or currentUserId is null
      Ti.API.info "お気に入り画面に遷移するrowは生成しない"
    else  
      favoriteRow = @_createFavoriteRow()
      subMenuRows.push favoriteRow
    
    @subMenu.setData subMenuRows

    @listWindow.add @subMenu
    @listWindow.add @table
    @listWindow.add @activityIndicator
    
    return @listWindow
            
  _loadPrefectures:() ->
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json")
    file = prefectures.read().toString();
    json = JSON.parse(file);

    return json
  # 都道府県のリスト情報から日本の地域ｘ都道府県名の以下の様なリストを作成する
  # "北海道・東北":[ {},{} ],
  # "関東":[{},]
  # :

  _makePrefectureCategory: (data) ->
    _ =  require("lib/underscore")
    result = _.groupBy(data,(row) ->
      return row.area
    )
    return result
  _createNavbarElement:() ->
    
    
    listWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"リストから探す"

    if Ti.Platform.osname is 'iphone'
      @listWindow.setTitleControl listWindowTitle
      
    return
    
  _createFavoriteRow:() ->
    Ti.API.info "_createFavoriteRow start"
    favoriteRow = Ti.UI.createTableViewRow
      width:150
      height:@rowHeight
      backgroundColor:"f3f3f3"
      categoryName:"行きたいお店"

    love = String.fromCharCode("0xe06e")      
    favoriteIcon = Ti.UI.createLabel
      width:20
      left:10
      top:5
      color:"#FFEE55"
      font:
        fontSize: 24
        fontFamily:'LigatureSymbols'
      text:love
      textAlign:'left'
      
    
    favoriteLabel = Ti.UI.createLabel
      width:240
      height:24
      top:5
      left:30
      textAlign:'left'
      color:'#333'
      font:
        fontSize:16
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"行きたいお店"
      
    favoriteRow.add favoriteIcon
    favoriteRow.add favoriteLabel
    return favoriteRow
    
  _createSubMenuRow:(categoryName) ->
    headerPoint = Ti.UI.createView
      width:10
      height:30
      top:5
      left:10
      backgroundColor:@prefectureColorSet.name[categoryName]

    headerLabel = Ti.UI.createLabel
      text: categoryName
      top:5
      left:30
      color:"#222"
      font:
        fontSize:16
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'
          
    subMenuRow = Ti.UI.createTableViewRow
      width:'auto'
      height:@rowHeight
      backgroundColor:"f3f3f3"
      categoryName:categoryName

    subMenuRow.add headerPoint
    subMenuRow.add headerLabel
    return subMenuRow
    
  refreshTableData: (categoryName,selectedColor,selectedSubColor) =>        
    rows = []
    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    prefectureNameList = PrefectureCategory[categoryName]
      
    # 都道府県のエリア毎に都道府県のrowを生成
    for _items in prefectureNameList
      prefectureRow = Ti.UI.createTableViewRow
        width:'auto'
        height:40
        hasChild:true
        prefectureName:"#{_items.name}"

      textLabel = Ti.UI.createLabel
        width:240
        height:40
        top:5
        left:30
        textAlign:'left'
        color:'#333'
        font:
          fontSize:16
          fontFamily : 'Rounded M+ 1p'
          fontWeight:'bold'
        text:"#{_items.name}"
        
      prefectureRow.add textLabel
      rows.push prefectureRow

            
    @table.borderColor = selectedColor
    @table.backgroundColor = selectedSubColor
    return @table.setData rows
    
module.exports = listWindow