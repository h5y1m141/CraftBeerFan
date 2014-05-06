exports.move = (_tab,items) ->

  Ti.API.info "お店の件数は#{items.length}"
  shopDataRows = []      
  for item in items
    shopDataRow = createShopDataRow(item)
    shopDataRows.push(shopDataRow)
    
  Ti.API.info "お店の件数は#{shopDataRows.length}"
  Ti.API.info $.shopAreaDataWindow
  $.shopArea.setData shopDataRows
  return _tab.open $.shopAreaDataWindow  


createShopDataRow = (placeData) ->
    if placeData.shopFlg is "true"
      imagePath = "bottle.png"
    else  
      imagePath = "tumblrIcon.png"
    
    iconImage = $.UI.create 'ImageView',
      image:imagePath
      classes:"iconImage"

    titleLabel = $.UI.create 'Label',
      classes:"titleLabel"
      text:"#{placeData.shopName}"
      
    addressLabel = $.UI.create 'Label',
      text:"#{placeData.shopAddress}"
      classes:"addressLabel"

    shopDataRow = $.UI.create 'TableViewRow',
      placeData:placeData
      shopAddress:placeData.shopAddress
      classes:'shopData'
      
    shopDataRow.add titleLabel
    shopDataRow.add addressLabel
    shopDataRow.add iconImage

    return shopDataRow
  



  
