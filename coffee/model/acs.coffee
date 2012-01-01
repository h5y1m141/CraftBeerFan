class acs
  constructor:() ->
    @Cloud = require('ti.cloud')
    
  placesQuery:(latitude,longitude,callback) ->
    Ti.API.info "startplacesQuery"
    @Cloud.Places.query
      page: 1
      per_page: 20
      where:
        lnglat:
          $nearSphere:[longitude,latitude] 
          $maxDistance: 0.01
    , (e) ->
      if e.success
        result = []
        i = 0
        while i < e.places.length
          place = e.places[i]

          data =
            latitude: place.latitude
            longitude: place.longitude
            title:place.name
            phoneNumber: place.phone_number
            shopAddress: place.address

          result.push(data)
          i++

        return callback(result)
      else
        Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))

        
    
module.exports = acs  