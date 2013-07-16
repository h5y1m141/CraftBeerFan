class listWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#EDAD0B"
      
    listWindow = Ti.UI.createWindow
      title:"リスト"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:false
      navBarHidden:false
    
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
    @arrowImage = Ti.UI.createImageView
      width:50
      height:50
      left:150
      top:35
      borderRadius:5
      transform:Ti.UI.create2DMatrix().rotate(45)
      borderColor:"#f3f3f3"
      borderWidth:1
      backgroundColor:"#007FB1"
      
    ShopDataTableView = require('ui/shopDataTableView')
    shopDataTableView = new ShopDataTableView()
    @shopData = shopDataTableView.getTable()
    @subMenu.addEventListener('click',(e)=>
      categoryName = e.row.categoryName
      selectedColor = @prefectureColorSet.name[categoryName]
      selectedSubColor = @prefectureSubColorSet.name[categoryName]
      curretRowIndex　= e.index

      # animateした後のコールバック関数内では@xxxが
      # 参照できないために以下変数に格納する
      rowHeight = @rowHeight
      shopData = @shopData
      arrowImage = @arrowImage
      @arrowImage.hide()
      shopData.animate({
        duration:400
        left:300
      },() ->
        
        shopDataTableView.refreshTableData(categoryName,selectedColor,selectedSubColor)
        # arrowImageの高さの50ずらづだけだとrowの真ん中に位置しないため
        # 55ずらすことで丁度真ん中に位置する
        arrowImagePosition = (curretRowIndex+1) * rowHeight - 55
        arrowImage.backgroundColor = selectedColor
        arrowImage.top = arrowImagePosition

        shopData.animate({
          duration:400
          left:150
        },() ->
          arrowImage.show()
        )
      )
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
        selectedBackgroundColor:'transparent'
        backgroundColor:"f3f3f3"
        categoryName:"#{categoryName}"

            
      subMenuRow.add headerPoint
      subMenuRow.add headerLabel
      subMenuRows.push subMenuRow
      index++
      
    @subMenu.setData subMenuRows
    
    listWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"リストから探す"

    if Ti.Platform.osname is 'iphone'
      listWindow.setTitleControl listWindowTitle
      

    listWindow.add @subMenu
    listWindow.add @shopData
    listWindow.add @arrowImage
    return listWindow
            
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
        
module.exports = listWindow