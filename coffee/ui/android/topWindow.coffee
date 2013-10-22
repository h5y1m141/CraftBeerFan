class topWindow
  constructor:() ->
    ActivityIndicator = require("ui/android/activitiIndicator")
    @activityIndicator = new ActivityIndicator()
    
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#EDAD0B"
      
    @topWindow = Ti.UI.createWindow
      title:"トップ"
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
        width:'400dip'
        height:'60dip'
        left:"30dp"
        top:'5dip'
      events:
        click:@showShopArea
    ]
      
    listView = Ti.UI.createListView
      templates:
        template: myTemplate
      defaultItemTemplate: "template"


    sections = @_createPrefectureSections()              
    listView.setSections sections
    
    @topWindow.add listView
    @topWindow.add @activityIndicator    
    return @topWindow
    
    
  _loadPrefectures:() ->
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json")
    file = prefectures.read().toString();
    json = JSON.parse(file);

    return json

  _createPrefectureSections:() ->

    Prefectures = @_loadPrefectures()
    section1 = Ti.UI.createListSection
      headerTitle:"北海道・東北"
    section2 = Ti.UI.createListSection
      headerTitle:"関東"
    section3 = Ti.UI.createListSection
      headerTitle:"中部"
    section4 = Ti.UI.createListSection
      headerTitle:"近畿"
    section5 = Ti.UI.createListSection
      headerTitle:"中国・四国"
    section6 = Ti.UI.createListSection
      headerTitle:"九州・沖縄"
    array1 = []
    array2 = []
    array3 = []
    array4 = []
    array5 = []
    array6 = []                  
      
    for _items in Prefectures
      switch _items.area
        when "北海道・東北" then array1.push({title:{text:_items.name}})
        when "関東"       then array2.push({title:{text:_items.name}})
        when "中部"       then array3.push({title:{text:_items.name}})
        when "近畿"       then array4.push({title:{text:_items.name}})
        when "中国・四国"   then array5.push({title:{text:_items.name}})
        else array6.push({title:{text:_items.name}})

    section1.setItems array1
    section2.setItems array2
    section3.setItems array3
    section4.setItems array4
    section5.setItems array5
    section6.setItems array6                        

    sections = [section1,section2,section3,section4,section5,section6] 
    
    return sections
  showShopArea:(e) =>
    that = @
    that.activityIndicator.show()
    index = e.itemIndex
    prefectureName = e.section.items[index].title.text

    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    # kloudService.findShopData(prefectureName,(items) ->
    #   alert "start! items is #{items}"
    # )
    kloudService.findShopDataBy(prefectureName,(items) ->
      that.activityIndicator.hide()
      if items.length is 0
        alert "選択した地域のお店がみつかりません"
      else
        items.sort( (a, b) ->
          (if a.shopAddress > b.shopAddress then -1 else 1)
        )
        ShopAreaDataWindow = require("ui/android/shopAreaDataWindow")
        shopWindow = new ShopAreaDataWindow(items)
        shopWindow.open()
    )
    
module.exports = topWindow    