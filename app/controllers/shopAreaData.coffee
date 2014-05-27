Cloud = require("ti.cloud")   
exports.move = (_tab,prefectureName) ->
  _tab.open $.shopAreaDataWindow
  shopDataRows = []      
  placeQuery prefectureName,(items) ->
    for item in items
      shopDataRow = createShopDataRow(item)
      shopDataRows.push(shopDataRow)
      
    Ti.API.info $.shopAreaDataWindow
    $.activityIndicator.hide()
    $.shopArea.setData shopDataRows
  

$.shopArea.addEventListener 'click',(e) ->
  placeData = e.row.placeData
  shopDataDetailController = Alloy.createController('shopDataDetail')
  shopDataDetailController.move($.tabOne,placeData)
  
  # Cloud.Statuses.query
  #     page: 1
  #     per_page: 20
  #     where:
  #       place_id:placeData.placeID
  #   , (e) ->

  #     if e.success
  #       placeData.statuses = e.statuses
  #     else
  #       placeData.statuses = []
      
  #     shopDataDetailController = Alloy.createController('shopDataDetail')
  #     shopDataDetailController.move($.tabOne,placeData)
      
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
  
placeQuery = (prefectureName,callback) ->
  $.activityIndicator.show()
  Cloud.Places.query
    page: 1
    per_page:300
    where:
      state:prefectureName
  , (e) ->
    places = e.places
    $.activityIndicator.hide()

    if e.success
      if e.meta.total_pages is 0
        alert "選択した地域のお店がみつかりません"
      else
        result = []
        places.sort( (a, b) ->
          (if a.shopAddress > b.shopAddress then -1 else 1)
        )
        for place in places
          result.push({
            placeID:place.id
            latitude: place.latitude
            longitude: place.longitude
            shopName:place.name
            webSite: place.webSite
            shopAddress: place.address
            phoneNumber: place.phone_number
            shopFlg:place.custom_fields.shopFlg
            shopInfo:place.custom_fields.shopInfo
          })
        callback result
