Cloud = require("ti.cloud")
pageNumber  = 1
pageSection = 0
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

  
$.tableview.addEventListener 'scrollEnd', (e) ->
  $.tableview.scrollable = false
  $.tableview.opacity = 0.3
  statusesQuery pageNumber,(statuses) ->
    createOnTapInfo statuses
  
  
$.tableview.addEventListener 'click', (e) ->
  shopData = e.row.shopData
  shopDataDetailController = Alloy.createController('shopDataDetail')
  return shopDataDetailController.move($.tabOne,shopData)    

createOnTapInfo = (statuses) ->
  moment = require('momentmin')
  momentja = require('momentja')
  section = $.UI.create 'TableViewSection',
    title:'dumy'
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
  
exports.move = (_tab) ->
  _tab.open $.onTapWindow
  statusesQuery pageNumber,(statuses) ->
    section = createOnTapInfo(statuses)
    $.tableview.setData [section]
  

