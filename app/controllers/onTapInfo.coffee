Cloud = require("ti.cloud")
if Ti.Platform.name is 'iPhone OS'
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK
else
  style = Ti.UI.ActivityIndicatorStyle.DARK  

$.activityIndicator.style = style
$.tableview.addEventListener 'click', (e) ->
  shopData = e.row.shopData
  shopDataDetailController = Alloy.createController('shopDataDetail')
  return shopDataDetailController.move($.tabOne,shopData)    

createOnTapInfo = (statuses) ->
  rows = []
  moment = require('momentmin')
  momentja = require('momentja')
  
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
    rows.push row

  return $.tableview.setData rows

exports.move = (_tab) ->
  $.activityIndicator.show()
  
  Cloud.Statuses.query
    page: 1
    per_page: 20
  , (e) ->
    $.activityIndicator.hide()
    if e.success
      createOnTapInfo e.statuses
      
  _tab.open $.onTapWindow

