class subMenuTable
  constructor:() ->
    @prefectures = @_loadPrefectures()
    @subMenu = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      width:"150sp"
      height:'auto'
      left:0
      top:0
      zIndex:5
    @subMenu.addEventListener('click',(e)->
      categoryName = e.row.categoryName
      Ti.API.info categoryName
      shopData.refreshTableData(categoryName)

    )

    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    subMenuRows = []
    for categoryName of PrefectureCategory
      prefectureColorSet = "name":
        "北海道・東北":"#3261AB"
        "関東":"#007FB1"
        "中部":"#23AC0E"
        "近畿":"#FFE600"
        "中国・四国":"#F6CA06"
        "九州・沖縄":"#DA5019"
      
      headerPoint = Ti.UI.createView
        width:'10sp'
        height:"30sp"        
        top:5
        left:10
        backgroundColor:prefectureColorSet.name[categoryName]

      headerLabel = Ti.UI.createLabel
        text: "#{categoryName}"
        top:0
        left:30
        color:"#222"
        font:
          fontSize:'18sp'
          fontFamily:'Rounded M+ 1p'
          fontWeight:'bold'
            
      subMenuRow = Ti.UI.createTableViewRow
        width:'150sp'
        height:'40sp'
        backgroundColor:"f3f3f3"
        categoryName:"#{categoryName}"
      
      subMenuRow.add headerPoint
      subMenuRow.add headerLabel
      subMenuRows.push subMenuRow
      
    @subMenu.setData subMenuRows
    return @subMenu
            
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
    _ =  require("lib/underscore-1.4.3.min")
    result = _.groupBy(data,(row) ->
      return row.area
    )
    return result
    
    
module.exports = subMenuTable