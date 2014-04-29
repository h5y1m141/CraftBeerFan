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
  
prefectures = Ti.Filesystem.getFile("prefectures.json")

$.mainMenu.addEventListener 'click', (e) ->
  Ti.API.info "都道府県のカテゴリ名は#{categoryName}"  
  categoryName = e.row.categoryName

  selectedColor = prefectureColorSet.name[categoryName]
  selectedSubColor = "#FFF"
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
  Ti.API.info prefectureName
  


makePrefectureCategory = () ->
  
  _ = require("alloy/underscore")._
  file = prefectures.read().toString();
  data = JSON.parse(file);
  
  result = _.groupBy(data,(row) ->
    return row.area
  )
  
  
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
  PrefectureCategory = makePrefectureCategory(prefectures)
  prefectureNameList = PrefectureCategory[categoryName]
    
  # 都道府県のエリア毎に都道府県のrowを生成
  for _items in prefectureNameList
    prefectureRow = $.UI.create 'TableViewRow',
      classes:"prefectureRow"
      prefectureName:"#{_items.name}"

    prefectureLabel = $.UI.create 'Label',
      text:"#{_items.name}"
      classes:"prefectureLabel"
      
    prefectureRow.add prefectureLabel
    rows.push prefectureRow
          
  $.subMenu.borderColor = selectedColor
  $.subMenu.backgroundColor = selectedSubColor
  $.subMenu.setData rows
  
exports.move = (_tab) ->
  PrefectureCategory = makePrefectureCategory()
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

