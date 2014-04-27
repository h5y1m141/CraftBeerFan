exports.move = (_tab) ->
  $.activityIndicator.show()
  Cloud = require("ti.cloud")
  Cloud.Statuses.query
    page: 1
    per_page: 20
  , (e) ->
    $.activityIndicator.hide()
    if e.success
      createOnTapInfo e.statuses
      
  _tab.open $.onTapWindow

if Ti.Platform.name is 'iPhone OS'
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK
else
  style = Ti.UI.ActivityIndicatorStyle.DARK  

$.activityIndicator.style = style
$.tableview.addEventListener 'click', (e) ->
  shopDataDetailController = Alloy.createController('shopDataDetail')
  return shopDataDetailController.move($.tabOne,e.row.shopData)  

createOnTapInfo = (statuses) ->
  rows = []
  for status in statuses
    shopData =
      shopName:status.place.shopName
      phoneNumber:status.place.phoneNumber
      latitude: status.place.latitude
      longitude: status.place.longitude
      shopInfo: status.place.shopInfo
      statuses:status
    

    row = $.UI.create 'TableViewRow',
      classes:'onTapRow'
      shopData:shopData
      
    shopName = $.UI.create 'Label',
      classes:"shopName"
      text:status.place.name
    label = $.UI.create 'Label',
      classes:"onTapLabel"
      text:status.message
      
    row.add shopName
    row.add label
    rows.push row

  return $.tableview.setData rows
