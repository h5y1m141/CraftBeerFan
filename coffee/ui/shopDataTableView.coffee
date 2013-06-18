class shopDataTableView
  constructor: () ->
    
    @prefectures = @_loadPrefectures()
    @table = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      width:'auto'
      height:'auto'
      left:"150sp"
      top:0
      zIndex:10
      
    @table.hide()
    @shopData = @_loadData()

    @table.addEventListener('click',(e) =>
      that = @
      opendFlg = e.row.opendFlg
      prefectureNameList = e.row.prefectureNameList
      curretRowIndex = e.index
      if opendFlg is false
        @_showSubMenu(prefectureNameList,curretRowIndex)
          
        e.row.opendFlg = true          
      else if opendFlg is true
        @_hideSubMenu(curretRowIndex,prefectureNameList.length)
        e.row.opendFlg = false
      else

        prefectureName = e.row.prefectureName
        shopDataList = @_groupingShopDataby(prefectureName)
        
        shopDataRows = []
        shopDataRowTable = Ti.UI.createTableView
          width:'auto'
          height:'auto'
          
        shopDataRowTable.addEventListener('click',(e) ->
          Ti.API.info "start. data is #{e.row.placeData}"
        )
        if typeof shopDataList[prefectureName] is "undefined"
          alert "選択した地域のお店がみつかりません"
        else
        
          for _items in shopDataList[prefectureName]
            Ti.API.info "お店の名前:#{_items.name}"
            shopDataRow = @_createShopDataRow(_items)
            shopDataRows.push(shopDataRow)
            
          shopDataRowTable.startLayout()
          shopDataRowTable.setData(shopDataRows)
          shopDataRowTable.finishLayout()
          
          shopAreaDataWindowTitle = Ti.UI.createLabel
            textAlign: 'center'
            color:'#333'
            font:
              fontSize:'18sp'
              fontFamily : 'Rounded M+ 1p'
              fontWeight:'bold'
            text:"地域別のお店情報"

          backButton = Titanium.UI.createButton
            backgroundImage:"ui/image/backButton.png"
            width:"44sp"
            height:"44sp"
          backButton.addEventListener('click',(e) ->
            return shopWindow.close({animated:true})
          )      
          shopWindow = Ti.UI.createWindow
            title: "地域別のお店情報"
            barColor:"#f9f9f9"
            backgroundColor: "#343434"
          shopWindow.leftNavButton = backButton
          if Ti.Platform.osname is 'iphone'
            shopWindow.setTitleControl shopAreaDataWindowTitle
          
          shopWindow.add shopDataRowTable
          activeTab = Ti.API._activeTab
          activeTab.open(shopWindow )
          return
    ) # end of tableView Event
    
    return
    
  getTable:() ->
    return @table
    
  refreshTableData: (categoryName) ->        
    rows = []
    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    prefectureNameList = PrefectureCategory[categoryName]
      
    # 都道府県のエリア毎に都道府県のrowを生成
    for _items in prefectureNameList
      prefectureRow = Ti.UI.createTableViewRow
        width:'auto'
        height:'40sp'
        hasChild:true
        prefectureName:"#{_items.name}"

      textLabel = Ti.UI.createLabel
        width:240
        height:40
        top:5
        left:30
        color:'#333'
        font:
          fontSize:'18sp'
          fontFamily : 'Rounded M+ 1p'
          fontWeight:'bold'
        text:"#{_items.name}"
        
      prefectureRow.add textLabel
      rows.push prefectureRow
      
    @table.setData rows
    return @table.show()

  # 都道府県のリスト情報から日本の地域ｘ都道府県名の以下の様なリストを作成する
  # "北海道・東北":[ {},{} ],
  # "関東":[{},]
  # :

  _makePrefectureCategory: (data) ->
    _ =  require("lib/underscore-1.4.3.min")
    result = _.groupBy(data,(row) ->
      return row.area
    )
    return result
    
  _showSubMenu:(prefectureNameList,curretRowIndex) ->
    
    index = curretRowIndex
    Ti.API.info "curretRowIndex is #{curretRowIndex} and #{prefectureNameList.length}"

      
    for item in prefectureNameList
      subMenu = Ti.UI.createTableViewRow
        width:'auto'
        height:40
        borderWidth:0
        className:'subMenu'
        backgroundColor:"#f3f3f3"
        separatorColor: '#cccccc'
        
        prefectureName:item.name

      subMenuLabel = Ti.UI.createLabel
        width:240
        height:40
        top:5
        left:30
        color:'#333'
        font:
          fontFamily : 'Rounded M+ 1p'
          fontSize:'18sp'
        text:item.name
      subMenu.add subMenuLabel
      @table.insertRowAfter(index,subMenu,{animated:false})
      @_sleep(100)
      index++
      Ti.API.info "index is #{index}"
      # Ti.API.info item.name
  
    return
    
  _hideSubMenu:(curretRowIndex,numberOfPrefecture) =>
    if curretRowIndex is 0
      startPosition = numberOfPrefecture
    else
      startPosition = numberOfPrefecture + curretRowIndex
      
    endPosition = curretRowIndex+1
    Ti.API.info "start is #{startPosition} and end is  #{endPosition}"
    for counter in [startPosition..endPosition]
      @table.deleteRow counter
      @_sleep(100)


    return
    
  # 以下URLを参照してビジーループというアプローチでsleepを実装
  # http://yanor.net/wiki/?JavaScript%2F%E3%82%BF%E3%82%A4%E3%83%9E%E3%83%BC%E5%87%A6%E7%90%86%2Fsleep%E3%81%84%E3%82%8D%E3%81%84%E3%82%8D    
  _sleep:(time) ->
    d1 = new Date().getTime()
    d2 = new Date().getTime()
    d2 = new Date().getTime()  while d2 < d1 + time
    return
    
  _createShopDataRow:(placeData) ->
    titleLabel = Ti.UI.createLabel
      width:240
      height:20
      top:5
      left:5
      color:'#333'
      font:
        fontSize:'16sp'
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.name}"
      
    addressLabel = Ti.UI.createLabel
      width:240
      height:20
      top:25
      left:20
      color:'#444'
      font:
        fontSize:'12sp'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.address}"

    row = Ti.UI.createTableViewRow
      width:'auto'
      height:'45sp'
      borderWidth:0
      hasChild:true
      placeData:placeData
      className:'shopData'
    row.add titleLabel
    row.add addressLabel
    return row
    
  _loadData:() ->
    shopData = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/shopData.json")
    file = shopData.read().toString();
    json = JSON.parse(file);

    return json
  _loadPrefectures:() ->
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json")
    file = prefectures.read().toString();
    json = JSON.parse(file);

    return json
    
  # 引数に与えた都道府県名にマッチするお店
  # 情報だけを抽出する
  _groupingShopDataby:(prefectureName) ->
    _ =  require("lib/underscore-1.4.3.min")
    _result = _.groupBy(@shopData,(row) ->
      row.state
    )
    
    return _result
    

module.exports = shopDataTableView


