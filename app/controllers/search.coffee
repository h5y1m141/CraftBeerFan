prefectureColorSet = "name":
  "北海道・東北":"#3261AB"
  "関東":"#007FB1"
  "中部":"#23AC0E"
  "近畿":"#FFE600"
  "中国・四国":"#F6CA06"
  "九州・沖縄":"#DA5019"
  
prefectureSubColorSet = "name":  
  "北海道・東北":"#D5E0F1"
  "関東":"#CAE7F2"
  "中部":"#D1F1CC"
  "近畿":"#FFFBD5"
  "中国・四国":"#FEF7D5"
  "九州・沖縄":"#F9DFD5"
  
prefectureData = null

Cloud = require("ti.cloud")    

$.mainMenu.addEventListener 'click', (e) ->
  categoryName = e.row.categoryName
  Ti.API.info "都道府県のカテゴリ名は#{categoryName}"  
  selectedColor = prefectureColorSet.name[categoryName]
  selectedSubColor = "#fcfcfc"
  curretRowIndex　= e.index
  t1 = Titanium.UI.create2DMatrix().scale(0.0)
  a = Titanium.UI.createAnimation()
  a.transform = t1
  a.duration = 400
  a.addEventListener('complete',() ->
    t2 = Titanium.UI.create2DMatrix()
    $.subMenu.animate
      transform:t2
      duration:400
  )  
  $.subMenu.animate(a,()->
    refreshTableData(categoryName,selectedColor,selectedSubColor)
  )
  
       
$.subMenu.addEventListener 'click', (e) ->
  prefectureName = e.row.prefectureName

  KloudService = require("kloudService")
  kloudService = new KloudService()
  $.activityIndicator.show()
  kloudService.findShopDataBy prefectureName,(items) ->
    $.activityIndicator.hide()
    if items.length is 0
      alert "選択した地域のお店がみつかりません"
    else
      Ti.API.info "kloudService success"
      items.sort( (a, b) ->
        (if a.shopAddress > b.shopAddress then -1 else 1)
      )
      shopAreaDataController = Alloy.createController("shopAreaData")
      shopAreaDataController.move($.tabOne,items)


makePrefectureCategory = (callback) ->
  _ = require("alloy/underscore")._
  Cloud.Objects.query
    classname:"shopDataByPrefecture"
    page: 1
    per_page:1
  , (items) ->
    shopData = items.shopDataByPrefecture[0].shopData
    result = _.groupBy(shopData	,(row) ->
      return row.area
    )
    callback result
  
  
createMainMenuRow =(categoryName) ->
  headerPoint = $.UI.create 'View',
    classes:"headerPoint"
    backgroundColor:prefectureColorSet.name[categoryName]

  headerLabel = $.UI.create 'Label',
    text: categoryName
    classes:"headerLabel"
        
  mainMenuRow = $.UI.create 'TableViewRow',
    categoryName:categoryName
    classes:"mainMenuRow"

  mainMenuRow.add headerPoint
  mainMenuRow.add headerLabel
  return mainMenuRow
  
refreshTableData = (categoryName,selectedColor,selectedSubColor) =>        
  rows = []

  prefectureNameList = prefectureData[categoryName]
    
  # 都道府県のエリア毎に都道府県のrowを生成
  for _items in prefectureNameList
    prefectureRow = $.UI.create 'TableViewRow',
      classes:"prefectureRow"
      prefectureName:"#{_items.name}"

    prefectureLabel = $.UI.create 'Label',
      text:"#{_items.name}：#{_items.numberOfshopData}軒"
      classes:"prefectureLabel"
      
    numberOfshopData = $.UI.create 'Label',
      text:"登録数：#{_items.numberOfshopData}店"
      classes:"numberOfshopData"

    # prefectureRow.add numberOfshopData            
    prefectureRow.add prefectureLabel
    rows.push prefectureRow
          
  $.subMenu.borderColor = selectedColor
  $.subMenu.backgroundColor = selectedSubColor
  $.subMenu.setData rows
  
exports.move = (_tab) ->

  makePrefectureCategory (PrefectureCategory) ->
    prefectureData = PrefectureCategory
    mainMenuRows = []

    # 起動時にはエリアに紐づく都道府県名を見せたくないのと
    # 後でanimationで表示・非表示を切り替えるために以下の処理を実施
    t = Titanium.UI.create2DMatrix().scale(0)
    $.subMenu.transform = t
    for categoryName of PrefectureCategory
      row = createMainMenuRow(categoryName)
      mainMenuRows.push row
      $.mainMenu.setData mainMenuRows

    _tab.open $.searchWindow

