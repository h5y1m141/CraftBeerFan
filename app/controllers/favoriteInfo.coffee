Cloud = require("ti.cloud")
$.tableview.addEventListener 'click', (e) ->
  $.activityIndicator.show()

exports.move = (_tab) ->
  _tab.open $.favoriteWindow
  currentUserId = Ti.App.Properties.getString "currentUserId"
  if currentUserId is null or typeof currentUserId is "undefined"
    alert "ユーザ登録が完了していないようなのでこの機能は利用できません"
  else
    $.activityIndicator.show()
    
    getReviews currentUserId, (idList,result) ->
      createShopDataList idList,result, (items) ->
        $.activityIndicator.hide()
        createFavoriteInfo(items)                    


# お店の所在地、名前の情報は、ACSのPlacesに格納されてるため
# 引数にPlaceIDを渡して、該当のお店の情報を得たら、あらかじめ
# 生成してあるお気に入り時のコメント情報とマージしたオブジェクトを
# 生成する
createShopDataList = (idList,result,callback) ->                            
  Cloud.Places.query
    page:1
    per_page:20
    where:
      _id:
         '$in':idList
  , (e) ->
    if e.success
      _ = require("alloy/underscore")._
      places = e.places
      shopData = []
      for place in places
        _data = _.where(result,{placeID:place.id})
        shopData.push({
          placeID:place.id
          reviewContent:_data[0].reviewContent
          state:place.state
          name:place.name
          updated_at:_data[0].updated_at
        })
      _items = _.sortBy shopData, (_d) ->
        return _d.updated_at
        
      Ti.API.info _items.reverse()
      callback _items


          

      # act e.reviews, (result) ->
      #   $.activityIndicator.hide()  
      #   createFavoriteInfo(places)                    

getReviews = (currentUserId,callback) ->
  Cloud.Reviews.query
    page:1
    per_page:5
    where:
      user_id:currentUserId
  , (e) ->
    reviews = e.reviews
    idList = []
    result = []
    for review in reviews
      idList.push review.custom_fields.place_id
      result.push({
        placeID:review.custom_fields.place_id
        reviewContent:review.content
        updated_at:review.updated_at
      })
    return callback idList,result  
  
createFavoriteInfo = (places) ->
  rows = []
  moment = require('momentmin')
  momentja = require('momentja')
  
  for place in places
    Ti.API.info place
    row = $.UI.create 'TableViewRow',
      classes:'favoriteRow'
      shopID:place.id
      
    reviewContent = $.UI.create 'Label',
      classes:"reviewContent"
      text:place.reviewContent
      
    shopName = $.UI.create 'Label',
      classes:"shopName"
      text:"#{place.name}（#{place.state}）"
      
    postedDateLabel = $.UI.create 'Label',
      text:moment(place.created_at).fromNow()
      classes:"postedDateLabel"
      
    row.add reviewContent
    row.add shopName
    row.add postedDateLabel
    rows.push row
    
  return $.tableview.setData rows
  
