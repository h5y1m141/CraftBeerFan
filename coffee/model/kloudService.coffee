class kloudService
  constructor:() ->
    @Cloud = require('ti.cloud')
    Ti.API.debug " @Cloud #{@Cloud.Places.query}"

  placesQuery:(latitude,longitude,callback) ->
    Ti.API.info "startplacesQuery latitude is #{latitude} and longitude is #{longitude}"
    @Cloud.Places.query
      page: 1
      per_page: 20
      where:
        lnglat:
          $nearSphere:[longitude,latitude] 
          $maxDistance: 0.01
    , (e) ->
      Ti.API.info "event is #{e.success} and #{e.places.length}"      
      if e.success

        result = []
        i = 0
        while i < e.places.length
          place = e.places[i]
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
    fb = require('facebook')
    @Cloud.SocialIntegrations.externalAccountLogin
      type: "facebook"
      token:fb.accessToken
    , (result) ->
      return callback(result)
      
        
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
        
        Ti.API.info "placeID is #{id}. and ratings is #{ratings} and contents is #{contents} and currentUserId is #{currentUserId}"
        if contents is "" or contents is null
          contents = null
           
        that.Reviews.create
          rating:1
          content:contents              
          place_id:id
          user_id:currentUserId
          custom_fields:
            place_id:id
            
        , (result) ->

          if e.success
            callback(result)
          else
            callback(result)
      else
        Ti.API.info "Error:\n"
        
    return
    
  reviewsQuery:(callback) =>
    userID = Ti.App.Properties.getString "currentUserId"
    Ti.API.info "reviewsQuery start.userID is #{userID}"
    shopLists = []
    placeIDList = []
    that = @Cloud
    # 該当するユーザのお気に入り情報を検索する
    @Cloud.Reviews.query
      page: 1
      per_page:50
      response_json_depth:5
      where:
        user_id:userID

    , (e) ->

        Ti.API.info "お気に入り情報が見つかったのでお店のデータを取得。お店の件数:#{e.reviews.length}"
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
                    shopInfo:e.places[0].custom_fields.shopInfo
                
              shopLists.push data

            else
              Ti.API.info "no review data"

        timerId = setInterval (->

          if placeQueryCounter is length
            callback(shopLists)
            clearInterval(timerId)
        ),10
        
    

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
            shopInfo:place.custom_fields.shopInfo
            

          result.push(data)
          i++

        return callback(result)
      else
        Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
        
  findShopData:(queryParam,callback) ->
    prefectureName = ["神奈川県","千葉県"]
    @Cloud.Places.query
      page: 1
      per_page: 200
      where:
        state:
          $in:prefectureName

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
            shopInfo:place.custom_fields.shopInfo
            

          result.push(data)
          i++
        Ti.API.info "findShopData done result is #{result}"
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

  sendFeedBack:(contents,shopName,currentUserId,callback) ->
    @Cloud.Emails.send
      template:'feedbackAboutShopData'
      recipients:'h5y1m141@gmail.com'
      contents:contents
      shopName:shopName
      currentUserId:currentUserId
    , (result) ->
      return callback(result)
      
  statusesQuery:(placeID,callback) ->
    @Cloud.Statuses.query
      page: 1
      per_page: 20
      where:
        place_id:placeID
    , (e) ->
      Ti.API.info e
      if e.success

        callback e.statuses
      else
        noData = []
        callback noData
    
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
    

module.exports = kloudService
