
exports.move = (_tab) ->
  $.mapview.region =
    latitude:35.676564
    longitude:139.765076
    latitudeDelta:0.025
    longitudeDelta:0.025
  placesQuery(34.676564,138.765076,(result) ->
    alert result

  )
  _tab.open $.mapWindow

  
placesQuery = (latitude,longitude,callback) ->
  place = Alloy.createModel("Shops")
  place.placesQuery
    latitude:latitude  
    longitude:longitude
    success:(_model, _response) ->
      Ti.API.info _model
      callback _model

  
