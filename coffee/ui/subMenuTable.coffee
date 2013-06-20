class subMenuTable
  constructor:() ->
    @prefectures = @_loadPrefectures()
    @rowHeight =  60
    @subMenu = Ti.UI.createTableView
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      width:"auto"
      height:'auto'
      left:0
      top:0
      zIndex:5
      
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
      selectedColor = @prefectureColorSet.name[categoryName]
      selectedSubColor = @prefectureSubColorSet.name[categoryName]
      curretRowIndex　= e.index
      shopData.refreshTableData(categoryName,selectedColor,selectedSubColor)
      
      # arrowImageの高さの50ずらづだけだとrowの真ん中に位置しないため
      # 55ずらすことで丁度真ん中に位置する
      arrowImagePosition = (curretRowIndex+1) * @rowHeight - 55
      cbFan.arrowImage.backgroundColor = selectedColor
      cbFan.arrowImage.top = arrowImagePosition
      cbFan.arrowImage.show()

    )

    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    subMenuRows = []
    index = 0
    for categoryName of PrefectureCategory
      
      headerPoint = Ti.UI.createView
        width:'10sp'
        height:"50sp"        
        top:5
        left:10
        backgroundColor:@prefectureColorSet.name[categoryName]

      headerLabel = Ti.UI.createLabel
        text: "#{categoryName}"
        top:15
        left:30
        color:"#222"
        font:
          fontSize:'18sp'
          fontFamily:'Rounded M+ 1p'
          fontWeight:'bold'
            
      subMenuRow = Ti.UI.createTableViewRow
        width:150
        height:@rowHeight
        rowID:index
        touchEnabled:false
        bubbleParent:false        
        backgroundColor:"f3f3f3"
        categoryName:"#{categoryName}"
      
      subMenuRow.add headerPoint
      subMenuRow.add headerLabel
      subMenuRows.push subMenuRow
      index++
      
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