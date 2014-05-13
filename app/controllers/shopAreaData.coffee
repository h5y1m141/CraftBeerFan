Cloud = require("ti.cloud")   
exports.move = (_tab,items) ->
  _tab.open $.shopAreaDataWindow  
  shopDataRows = []      
  for item in items
    shopDataRow = createShopDataRow(item)
    shopDataRows.push(shopDataRow)
    
  Ti.API.info $.shopAreaDataWindow
  $.shopArea.setData shopDataRows
  return 

$.shopArea.addEventListener 'click',(e) ->
  $.activityIndicator.show()
  placeData = e.row.placeData
  Cloud.Statuses.query
      page: 1
      per_page: 20
      where:
        place_id:placeData.placeID
    , (e) ->
      $.activityIndicator.hide()
      if e.success
        placeData.statuses = e.statuses
      else
        placeData.statuses = []
      
      shopDataDetailController = Alloy.createController('shopDataDetail')
      shopDataDetailController.move($.tabOne,placeData)
      
createShopDataRow = (placeData) ->
  
  if placeData.shopFlg is "true"
    imagePath = Ti.Filesystem.resourcesDirectory + "bottle.png"
  else  
    imagePath = Ti.Filesystem.resourcesDirectory + "tmulblr.png"


  titleLabel = $.UI.create 'Label',
    text:"#{placeData.shopName}"  
    classes:"titleLabel"
    
  addressLabel = $.UI.create 'Label',
    text:"#{placeData.shopAddress}"
    classes:"addressLabel"

  shopDataRow = $.UI.create 'TableViewRow',
    placeData:placeData
    classes:'shopData'
    
  shopIcon = Ti.UI.createImageView
    left:5
    top: 5    
    width:20
    height:30
    image:imagePath

  shopDataRow.add titleLabel
  shopDataRow.add addressLabel
  shopDataRow.add shopIcon

  return shopDataRow
  
