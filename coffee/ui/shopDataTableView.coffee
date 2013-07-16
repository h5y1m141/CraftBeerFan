class shopDataTableView
  constructor: () ->
    @prefectures = @_loadPrefectures()
    @table = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
      width:'auto'
      height:'auto'
      left:150
      top:0
      borderColor:"#f3f3f3"
      borderWidth:2
      zIndex:10
      
    @table.hide()
    @shopData = @_loadData()

    @table.addEventListener('click',(e) =>
      prefectureName = e.row.prefectureName
      KloudService = require("model/kloudService")
      kloudService = new KloudService()
      kloudService.finsShopDataBy(prefectureName,(items) ->
        if items.length is 0
          alert "選択した地域のお店がみつかりません"
        else
          Ti.API.info "kloudService success"

          ShopAreaDataWindow = require("ui/shopAreaDataWindow") 
          shopAreaDataWindow = new ShopAreaDataWindow(items)
          
      )
      
    ) # end of tableView Event
    
    return
    
  getTable:() ->
    return @table
    
  refreshTableData: (categoryName,selectedColor,selectedSubColor) ->        
    rows = []
    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    prefectureNameList = PrefectureCategory[categoryName]
      
    # 都道府県のエリア毎に都道府県のrowを生成
    for _items in prefectureNameList
      prefectureRow = Ti.UI.createTableViewRow
        width:'auto'
        height:60
        hasChild:true
        prefectureName:"#{_items.name}"

      textLabel = Ti.UI.createLabel
        width:240
        height:40
        top:5
        left:30
        color:'#333'
        font:
          fontSize:18
          fontFamily : 'Rounded M+ 1p'
          fontWeight:'bold'
        text:"#{_items.name}"
        
      prefectureRow.add textLabel
      rows.push prefectureRow
      
    @table.borderColor = selectedColor
    @table.backgroundColor = selectedSubColor
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
    
    
  _createShopDataRow:(placeData) ->

    titleLabel = Ti.UI.createLabel
      width:240
      height:30
      top:5
      left:5
      color:'#333'
      font:
        fontSize:18
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.name}"
      
    addressLabel = Ti.UI.createLabel
      width:240
      height:30
      top:30
      left:20
      color:'#444'
      font:
        fontSize:14
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.address}"

    row = Ti.UI.createTableViewRow
      width:'auto'
      height:60
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


