class kloudService
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
            shopName:place.name
            shopAddress: place.address
            phoneNumber: place.phone_number
            shopFlg:place.custom_fields.shopFlg
            
          result.push(data)
          i++

        return callback(result)
      else
        Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
        
  cbFanLogin:(userID,password,callback) ->
    @Cloud.Users.login
      login:userID
      password:password
    , (result) ->
      return callback(result)
    
    return
  fbLogin:(callback) ->

    fb = require('facebook');
    fb.appid = @_getAppID()
    fb.permissions =  ['read_stream']
    fb.forceDialogAuth = true
    fb.addEventListener('login', (e) =>
      token = fb.accessToken
      if e.success
        if e.success
          @Cloud.SocialIntegrations.externalAccountLogin
            type: "facebook"
            token: token
          , (e) ->
            callback(e)
            # if e.success
            #   user = e.users[0]

            #   Ti.API.info "User  = " + JSON.stringify(user)
            #   Ti.App.Properties.setString "currentUserId", user.id
            #   callback(user.id)
            # else
            #   alert "Error: " + ((e.error and e.message) or JSON.stringify(e))
        
      else if e.error
        alert e.error
      else alert "Canceled"  if e.cancelled
    )
    fb.addEventListener('logout',(e)->
      alert 'logout'
    )
    
    fb.authorize()  unless fb.loggedIn

    return
  reviewsCreate:(ratings,contents,shopName,currentUserId,callback) =>
    that = @Cloud
    Ti.API.info "reviewsCreate start shopName is #{shopName}"
    @Cloud.Places.query
      page: 1
      per_page: 1
      where:
        name:shopName
    , (e) ->
      if e.success
        id = e.places[0].id
        
        Ti.API.info "id is #{id}. and ratings is #{ratings} and contents is #{contents}"
        
        that.Reviews.create
          rating:ratings
          content:contents              
          place_id:id
          user_id:currentUserId
          custom_fields:
            place_id:id
            
        , (e) ->

          if e.success
            callback("success")
          else
            callback("error")
      else
        Ti.API.info "Error:\n"
        
    return
    
  reviewsQuery:(userID,callback) ->
    Ti.API.info "reviewsQuery start userID is #{userID}"
    shopLists = []
    placeIDList = []
    that = @Cloud
    # 該当するユーザのお気に入り情報を検索する
    @Cloud.Reviews.query
      page: 1
      per_page:100
      response_json_depth:5
      user_id:userID
    , (e) ->
      if e.success

        i = 0
        while i < e.reviews.length
          review = e.reviews[i]
          # custom_fieldsに、該当するお気に入りのお店に関するplace_idを
          # 格納してあるのでそのIDを利用することでお店の住所、名前を取得
          # することができる
          item =
            placeID:review.custom_fields.place_id
            content:review.content
            rating:review.rating
            
          if typeof item.placeID isnt "undefined"
            placeIDList.push item
          # whileのループカウンターを1つプラス  
          i++
              
        # end of loop

        # forループ内のCloud.Places.showは非同期処理されてしまう
        # そのため全部の値を取得してからcallback関数に渡すためには
        # setIntervalで以下のカウンター変数の値をチェックする必要ある
        length = placeIDList.length
        placeQueryCounter = 0
        Ti.API.info "length is #{length}"
        for item in placeIDList

          that.Places.show
            place_id:item.placeID
          ,(e) ->
            
            placeQueryCounter++
            data = {}
            if e.success
              # お店の情報が見つかったらv.placeIDをキーにして
              # placeIDList内に存在するratingとcontent情報を
              # 取得した上で値を返す
              _ =  require("lib/underscore-1.4.3.min")
              .each placeIDList, (v,key) ->
                if v.placeID is e.places[0].id
                  data =
                  rating:v.rating
                  content:v.content
                  shopName:e.places[0].name
                  shopAddress:e.places[0].address
                  phoneNumber:e.places[0].phone_number
                  latitude:e.places[0].latitude
                  longitude:e.places[0].longitude
                  shopFlg:e.places[0].custom_fields.shopFlg
                
              shopLists.push data

            else
              Ti.API.info "no review data"

        timerId = setInterval (->

          if placeQueryCounter is length
            callback(shopLists)
            clearInterval(timerId)
        ),10
        

      else
        alert "データ取得できませんでした"
    

  findShopDataBy:(prefectureName,callback) ->
    @Cloud.Places.query
      page: 1
      per_page: 200
      where:
        state:prefectureName

    , (e) ->
      if e.success
        result = []
        i = 0
        while i < e.places.length
          place = e.places[i]
          data =
            latitude: place.latitude
            longitude: place.longitude
            shopName:place.name
            shopAddress: place.address
            phoneNumber: place.phone_number
            shopFlg:place.custom_fields.shopFlg
            
          result.push(data)
          i++

        return callback(result)
      else
        Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
        
  signUP:(userID,password,callback) ->
    @Cloud.Users.create
      username:userID
      email:userID
      password:password
      password_confirmation:password
    , (result) ->
      return callback(result)

      
  getCurrentUserInfo:(currentUserId,callback) ->
    @Cloud.Users.show
      user_id:currentUserId
    , (result) ->
      return callback(result)

  
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
    

module.exports = kloudService