Cloud = require("ti.cloud")
$.tableview.addEventListener 'click', (e) ->
  $.activityIndicator.show()

createFavoriteInfo = (items) ->
  rows = []
  moment = require('momentmin')
  momentja = require('momentja')
  
  for item in items
    row = $.UI.create 'TableViewRow',
      classes:'favoriteRow'
      shopID:item.custom_fields.place_id
      
    reviewContent = $.UI.create 'Label',
      classes:"reviewContent"
      text:item.content
    # shopName = $.UI.create 'Label',
    #   classes:"shopName"
    #   text:"#{item.place.name}（#{item.place.state}）"
      
    postedDateLabel = $.UI.create 'Label',
      text:moment(item.created_at).fromNow()
      classes:"postedDateLabel"
      
    row.add reviewContent
    row.add postedDateLabel
    rows.push row
    
  return $.tableview.setData rows
  
exports.move = (_tab) ->
  currentUserId = Ti.App.Properties.getString "currentUserId"
  if currentUserId is null or typeof currentUserId is "undefined"
    alert "ユーザ登録が完了していないようなのでこの機能は利用できません"
  else  
    Cloud.Reviews.query
      page:1
      per_page:20
      where:
        user_id:currentUserId
    , (e) ->

      Ti.API.info "Reviews.query is : #{e}"
      if e.success
        createFavoriteInfo(e.reviews)
        return _tab.open $.favoriteWindow


