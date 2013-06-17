class shopDataTableView
  constructor: () ->
    
    prefectures = [
      {"name":"北海道","area":"北海道・東北"},
      {"name":"青森県","area":"北海道・東北"},
      {"name":"岩手県","area":"北海道・東北"},
      {"name":"宮城県","area":"北海道・東北"},
      {"name":"秋田県","area":"北海道・東北"},
      {"name":"山形県","area":"北海道・東北"},
      {"name":"福島県","area":"北海道・東北"},
      {"name":"茨城県","area":"関東"},
      {"name":"栃木県","area":"関東"},
      {"name":"群馬県","area":"関東"},
      {"name":"埼玉県","area":"関東"},
      {"name":"千葉県","area":"関東"},
      {"name":"東京都","area":"関東"},
      {"name":"神奈川県","area":"関東"},
      {"name":"新潟県","area":"中部"},
      {"name":"富山県","area":"中部"},
      {"name":"石川県","area":"中部"},
      {"name":"福井県","area":"中部"},
      {"name":"山梨県","area":"中部"},
      {"name":"長野県","area":"中部"},
      {"name":"岐阜県","area":"中部"},
      {"name":"静岡県","area":"中部"},
      {"name":"愛知県","area":"中部"},
      {"name":"三重県","area":"近畿"},
      {"name":"滋賀県","area":"近畿"},
      {"name":"京都府","area":"近畿"},
      {"name":"大阪府","area":"近畿"},
      {"name":"兵庫県","area":"近畿"},
      {"name":"奈良県","area":"近畿"},
      {"name":"和歌山県","area":"近畿"},
      {"name":"鳥取県","area":"中国・四国"},
      {"name":"島根県","area":"中国・四国"},
      {"name":"岡山県","area":"中国・四国"},
      {"name":"広島県","area":"中国・四国"},
      {"name":"山口県","area":"中国・四国"},
      {"name":"徳島県","area":"中国・四国"},
      {"name":"香川県","area":"中国・四国"},
      {"name":"愛媛県","area":"中国・四国"},
      {"name":"高知県","area":"中国・四国"},
      {"name":"福岡県","area":"九州・沖縄"},
      {"name":"佐賀県","area":"九州・沖縄"},
      {"name":"長崎県","area":"九州・沖縄"},
      {"name":"熊本県","area":"九州・沖縄"},
      {"name":"大分県","area":"九州・沖縄"},
      {"name":"宮崎県","area":"九州・沖縄"},
      {"name":"鹿児島県","area":"九州・沖縄"},
      {"name":"沖縄県","area":"九州・沖縄"}      
    ]
    @table = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      width:'auto'
      height:'auto'
      left:0
      top:0
      
    @colorSet = [
      color:"#f9f9f9"
      position: 0.0
    ,
      color: "#f6f6f6"
      position: 0.5
    ,
      color: "#eeeeee"
      position: 1.0
    ]

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
          shopWindow.setTitleControl shopAreaDataWindowTitle
          
          shopWindow.add shopDataRowTable
          activeTab = Ti.API._activeTab
          activeTab.open(shopWindow )
          return
    )
    
    rows = []
    PrefectureCategory = @_makePrefectureCategory prefectures
    for categoryName of PrefectureCategory
      numberOfPrefecture = PrefectureCategory[categoryName].length
      prefectureNameList = PrefectureCategory[categoryName]
      prefectureColorSet = "name":
        "北海道・東北":"#EDAD0B"
        "関東":"#3261AB"
        "中部":"#FFEE55"
        "近畿":"#007AB7"
        "中国・四国":"#FFF7AA"
        "九州・沖縄":"#C6EDDB"
        
      roundLabel = Ti.UI.createLabel
        width:40
        height:40
        top:5
        left:5
        color:prefectureColorSet.name["#{categoryName}"]
        font:
          fontSize:'18sp'
          fontFamily : 'Rounded M+ 1p'
          fontWeight:'bold'
        text:"●"
      
      textLabel = Ti.UI.createLabel
        width:240
        height:40
        top:5
        left:50
        color:'#333'
        font:
          fontSize:'18sp'
          fontFamily : 'Rounded M+ 1p'
          fontWeight:'bold'
        text:"#{categoryName}"

      if Titanium.Platform.osname is "iphone"
        row = Ti.UI.createTableViewRow
          width:'auto'
          height:40
          borderWidth:0
          selectedBackgroundColor:"#EDAD0B"
          className:'shopData'
          numberOfPrefecture:numberOfPrefecture
          prefectureNameList:prefectureNameList
          opendFlg:false
        row.add textLabel
        row.add roundLabel
      else if Titanium.Platform.osname is "android"
        row = Ti.UI.createTableViewRow
          width:'auto'
          height:80
          selectedBackgroundColor:"#EDAD0B"
          className:'shopData'
          numberOfPrefecture:numberOfPrefecture
          prefectureNameList:prefectureNameList
          opendFlg:false
          
        view = Ti.UI.createView
          width:'auto'
          height:80
        view.add roundLabel
        view.add textLabel   
        row.add view
      else
        Ti.API.info 'no data'

      
      rows.push row
      
    @table.setData rows
    
    return @table

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

    if Titanium.Platform.osname is "iphone"
      row = Ti.UI.createTableViewRow
        width:'auto'
        height:45
        borderWidth:0
        hasChild:true
        placeData:placeData
        className:'shopData'
        backgroundGradient: 
          type: 'linear'
          startPoint: 
            x: '0%',
            y: '0%'
          ,
          endPoint: 
            x: '0%'
            y: '100%'
          ,
          colors: @colorSet
      row.add titleLabel
      row.add addressLabel
    else if Titanium.Platform.osname is "android"
      row = Ti.UI.createTableViewRow
        width:'auto'
        height:80
        className:'shopData'
        hasDetail:true
        
      view = Ti.UI.createView
        width:'auto'
        height:80
        backgroundGradient: 
          type: 'linear'
          startPoint: 
            x: '0%',
            y: '0%'
          ,
          endPoint: 
            x: '0%'
            y: '100%'
          ,
          colors: @colorSet
      view.add textLabel   
      row.add view    
    else
      Ti.API.info 'no platform'
    return row
    
  _loadData:() ->
    shopData = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/shopData.json")
    file = shopData.read().toString();
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


