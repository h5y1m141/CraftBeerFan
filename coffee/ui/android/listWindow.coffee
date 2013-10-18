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
      navBarHidden:false
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
      
    myTemplate = childTemplates: [
      # Title 
      type: "Ti.UI.Label" # Use a label for the title
      bindId:"title" # Maps to a custom info property of the item data
      properties: # Sets the label properties
        color: "#333"
        font:
          fontSize:'16dip'
          fontFamily : 'Rounded M+ 1p'
        width:'400dip'
        height:'80dip'
        left:"30dp"
        top:'5dip'
      events:
        click:@showShopArea
    ]
      
    @listView = Ti.UI.createListView
      templates:
        template: myTemplate
      defaultItemTemplate: "template"
      
      
    @prefectures = @_loadPrefectures()
    @refreshListViewData("関東","#CAE7F2","#CAE7F2")
    
    @listWindow.activity.onCreateOptionsMenu = (e) ->
      menu = e.menu
      actionBarMenu = require("ui/android/actionBarMenu")
      actionBarMenu = new actionBarMenu(menu)
      
    @listWindow.add @listView

    return @listWindow
    
  showShopArea:(e) ->
    index = e.itemIndex
    prefectureName = e.section.items[index].title.text

    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.findShopDataBy(prefectureName,(items) ->
      if items.length is 0
        alert "選択した地域のお店がみつかりません"
      else
        items.sort( (a, b) ->
          (if a.shopAddress > b.shopAddress then -1 else 1)
        )
        ShopAreaDataWindow = require("ui/android/shopAreaDataWindow")
        alert "ShopAreaDataWindow start"
        shopWindow = new ShopAreaDataWindow(items)
        shopWindow.open()
    )

    
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
  _createNavbarElement:() ->
    
      
    return
    
  _createFavoriteRow:() ->
    Ti.API.info "_createFavoriteRow start"
    favoriteRow = Ti.UI.createTableViewRow
      width:'600dip'
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
        fontSize:'16dip'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"行きたいお店"
      
    favoriteRow.add favoriteIcon
    favoriteRow.add favoriteLabel
    return favoriteRow
    
  _createSubMenuRow:(categoryName) ->
    headerPoint = Ti.UI.createView
      width:'20dip'
      height:'60dip'
      top:5
      left:10
      backgroundColor:@prefectureColorSet.name[categoryName]

    headerLabel = Ti.UI.createLabel
      text: categoryName
      top:'5dip'
      left:'30dip'
      color:"#222"
      font:
        fontSize:'16dip'
        fontFamily:'Rounded M+ 1p'
          
    subMenuRow = Ti.UI.createTableViewRow
      width:'auto'
      height:@rowHeight
      backgroundColor:"f3f3f3"
      categoryName:categoryName

    subMenuRow.add headerPoint
    subMenuRow.add headerLabel
    return subMenuRow
    
  refreshListViewData: (categoryName,selectedColor,selectedSubColor) =>        

    sections = []
    PrefectureCategory = @_makePrefectureCategory(@prefectures)
    prefectureNameList = PrefectureCategory[categoryName]
    prefectureSection = Ti.UI.createListSection()
    prefectureDataSet = []
    # 都道府県のエリア毎に都道府県のrowを生成
    for _items in prefectureNameList
      prefectureDataSet.push({title:{text:_items.name}})

    prefectureSection.setItems prefectureDataSet
    sections.push prefectureSection

    return @listView.setSections sections
    
module.exports = listWindow