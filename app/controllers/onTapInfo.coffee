Cloud = require("ti.cloud")
pageNumber  = 1
pageSection = 0
# 以下はスクロール時のイベント処理で必要になる変数
updating = false
numberOfRows = 575+1
showRows = 50
rowNumer = 1
lastDistance = 0

if Ti.Platform.name is 'iPhone OS'
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK
else
  style = Ti.UI.ActivityIndicatorStyle.DARK  

$.activityIndicator.style = style
$.RightNavButton.text = String.fromCharCode("0xe10e")
$.RightNavButton.addEventListener 'click', (e) ->
  # 一度初期状態に戻してからリフレッシュする
  pageNumber  = 1
  dummyRow = $.UI.create 'TableViewRow',
    classes:'dummyRow'
  $.tableview.setData [dummyRow]
  
  statusesQuery pageNumber,(statuses) ->
    section = createOnTapInfo(statuses)
    $.tableview.setData [section]

  
$.tableview.addEventListener 'click', (e) ->
  shopData = e.row.shopData
  shopDataDetailController = Alloy.createController('shopDataDetail')
  return shopDataDetailController.move($.tabOne,shopData)    

createOnTapInfo = (statuses) ->
  moment = require('momentmin')
  momentja = require('momentja')
  section = $.UI.create 'TableViewSection',
    classes:'onTapSection'
  
  for status in statuses
    shopData =
      placeID:status.place.id
      shopName:status.place.name
      phoneNumber:status.place.phone_number
      latitude: status.place.latitude
      longitude: status.place.longitude
      shopInfo:status.place.custom_fields.shopInfo
      webSite: status.place.webSite
      
    
    row = $.UI.create 'TableViewRow',
      classes:'onTapRow'
      shopData:shopData
      shopID:status.place.id
      
    shopName = $.UI.create 'Label',
      classes:"shopName"
      text:"#{status.place.name}（#{status.place.state}）"
    label = $.UI.create 'Label',
      classes:"onTapLabel"
      text:status.message
      
    postedDateLabel = $.UI.create 'Label',
      text:moment(status.created_at).fromNow()
      classes:"postedDateLabel"
      
    row.add shopName
    row.add label
    row.add postedDateLabel
    section.add row
  return section




statusesQuery = (page,callback)->
  $.activityIndicator.show()
  Cloud.Statuses.query
    page: page
    per_page: 20
  , (e) ->
    $.activityIndicator.hide()
    if e.success
      pageNumber++

      callback e.statuses
    else
      alert "開栓情報が取得できませんでした"

beginUpdate = () ->
  updating = true
  $.activityIndicator.show()
  setTimeout(endUpdate,2000)

  
endUpdate = () ->
  updating = false
  $.tableview.deleteRow(showRows,{})
  statusesQuery(pageNumber,(statuses) ->
    newSection = createOnTapInfo(statuses)
    $.tableview.insertSectionAfter(pageSection,newSection)
    pageNumber++
    pageSection++

  )   
  

$.tableview.addEventListener 'scroll', (e) ->
  if Ti.Platform.osname is "iphone"
    offset = e.contentOffset.y
    height = e.size.height
    total = offset + height
    theEnd = e.contentSize.height
    distance = theEnd - total
    Ti.API.info "#{distance} #{lastDistance}"
    if distance < lastDistance
      nearEnd = theEnd * .75
      Ti.API.info "nearEnd is #{nearEnd}"
      if not updating and (total >= nearEnd)
        beginUpdate()
        
    lastDistance = distance

      

exports.move = (_tab) ->
  _tab.open $.onTapWindow
  statusesQuery pageNumber,(statuses) ->
    section = createOnTapInfo(statuses)
    $.tableview.setData [section]
  

