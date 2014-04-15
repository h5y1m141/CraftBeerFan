exports.definition =
  config:
    columns:
      active: "boolean"

    adapter:
      type: "acs"
      collection_name: "places"

    settings:
      object_name: "places"
      object_method: "Places"

  extendModel: (Model) ->
    _.extend Model::,
      authenticated: ->
        
        # Ti.App.Properties is non secure, use the KeyChain in product
        if Ti.App.Properties.hasProperty("Cloud.sessionId")
          @config.Cloud.sessionId = Ti.App.Properties.getString("Cloud.sessionId")
          true
        else
          false
      placesQuery:(latitude,longitude,callback) ->
        @config.Cloud.Places.query
          page: 1
          per_page: 20
          where:
            lnglat:
              $nearSphere:[longitude,latitude] 
              $maxDistance: 0.01
        , (e) ->
          if e.success
            
            if _params.success
              Ti.App.Properties.setString "Cloud.sessionId", that.config.Cloud.sessionId
              Ti.API.info "e.places is #{e.places}"
              result = []
              for place in e.places
                # Ti.API.info place.name + place.custom_fields.statusesUpdate
                if typeof place.custom_fields.statusesUpdate isnt "undefined"
                  data =
                    id:place.id
                    latitude: place.latitude
                    longitude: place.longitude
                    shopName:place.name
                    shopAddress: place.address
                    phoneNumber: place.phone_number
                    shopFlg:place.custom_fields.shopFlg
                    shopInfo:place.custom_fields.shopInfo
                    statusesUpdate:place.custom_fields.statusesUpdate
                  
                else
                  data =
                    id:place.id
                    latitude: place.latitude
                    longitude: place.longitude
                    shopName:place.name
                    shopAddress: place.address
                    phoneNumber: place.phone_number
                    shopFlg:place.custom_fields.shopFlg
                    shopInfo:place.custom_fields.shopInfo
                    statusesUpdate: false
      
                result.push(data)
              

              callback result
            
            
          
      login: (_params) ->
        that = this
        @config.Cloud.Users.login
          login: _params.login
          password: _params.password
        , (e) ->
          if e.success
            if _params.success
              # Ti.App.Properties is non secure, use the KeyChain in product
              Ti.App.Properties.setString "Cloud.sessionId", that.config.Cloud.sessionId
              _params.success new model(e.users[0])
          else
            Ti.API.error e
            _params.error that, (e.error and e.message) or e  if _params.error
          return

        return

      logout: (_params) ->
        that = this
        @config.Cloud.Users.logout (e) ->
          if e.success
            if _params.success
              
              # Ti.App.Properties is non secure, use the KeyChain in product
              Ti.App.Properties.removeProperty "Cloud.sessionId"
              _params.success null
          else
            Ti.API.error e
            _params.error that, (e.error and e.message) or e  if _params.error
          return

        return

      show: (_params) ->
        that = this
        data = {}
        if _params.user_id
          data.user_id = _params.user_id
        else
          data.user_ids = _params.user_ids
        @config.Cloud.Users.show data, (e) ->
          if e.success
            _params.success new model(e.users[0])  if _params.success
          else
            Ti.API.error e
            _params.error that, (e.error and e.message) or e  if _params.error
          return

        return

      me: (_params) ->
        that = this
        @config.Cloud.Users.showMe (e) ->
          if e.success
            _params.success new model(e.users[0])  if _params.success
          else
            Ti.API.error e
            _params.error that, (e.error and e.message) or e  if _params.error
          return

        return

    Model

  extendCollection: (Collection) ->
    _.extend Collection::, {}
    Collection
