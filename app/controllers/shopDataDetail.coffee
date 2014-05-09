Cloud = require("ti.cloud")    
exports.move = (_tab,shopData) ->
  initUIElements shopData
  _tab.open $.shopDataDetail
  _createMapView shopData
  _createTableView shopData


_createMapView = (data) ->
  $.mapview.setLocation({
    latitude:data.latitude
    longitude:data.longitude
    latitudeDelta:0.005
    longitudeDelta:0.005
  })
    
  annotation = Alloy.Globals.Map.createAnnotation
    latitude: data.latitude
    longitude: data.longitude
    animate: false
    userLocation:false
    pincolor:Alloy.Globals.Map.ANNOTATION_RED

  return $.mapview.addAnnotation annotation
  
  
_createTableView = (data) ->
  shopData = []
  
  if data.statuses.length isnt 0
    Ti.API.info "create statuses data.statuses is #{data.statuses}"
    statusesRows = createStatusesRows(data.statuses)
    shopData.push statusesRows
    
  $.tableview.setData shopData


    

createStatusesRows = (statuses) ->
  
  moment = require('momentmin')
  momentja = require('momentja')

  statusSection = Ti.UI.createTableViewSection
    headerTitle:"開栓情報一覧"
    
  for obj in statuses
    statusRow = $.UI.create 'TableViewRow',
      classes:"statusRow"
    infoIconText = String.fromCharCode("0xe075")  
    infoIcon = $.UI.create 'Label',
      classes:'infoIcon'
      text: infoIconText
      
    statusLabel = $.UI.create 'Label',
      text:obj.message
      classes:"statusLabel"
    postedDateLabel = $.UI.create 'Label',
      text:moment(obj.created_at).fromNow()
      classes:"postedDateLabel"
        
    statusRow.add infoIcon
    statusRow.add statusLabel
    statusRow.add postedDateLabel
    statusSection.add statusRow
  return statusSection
  
initUIElements = (data) ->
  $.phoneIcon.title    = String.fromCharCode("0xf095")
  $.wantToGoIcon.title = String.fromCharCode("0xe030")
  $.feedBackIcon.title = String.fromCharCode("0xe041")
  $.webSiteIcon.title  = String.fromCharCode("0xe13f")
  $.shopInfoIcon.title = String.fromCharCode("0xe075")
  
  t = Titanium.UI.create2DMatrix().scale(0.0)
  $.phoneDialog.transform = t
  $.feedBackDialog.transform = t
  $.favoriteDialog.transform = t
  $.webSiteDialog.transform = t
  $.shopInfoDialog.transform = t

  initPhoneDialog(data)
  initFavoriteDialog(data.placeID)
  initFeedBackDialog(data.shopName)
  initWebSiteDialog(data)    
  initShopInfoDialog(data)  


initPhoneDialog = (data) ->
  $.phoneIcon.addEventListener 'click', (e) ->
    animateDialog($.phoneDialog,"show",Ti.API.info "done")
    
  $.callBtn.addEventListener 'click',(e) ->
    animateDialog($.phoneDialog,"hide",Titanium.Platform.openURL("tel:#{data.phoneNumber}"))
    
  $.cancelleBtn.addEventListener 'click',(e) ->
    animateDialog($.phoneDialog,"hide",Ti.API.info "cancelleBtn hide")    

  $.titleForPhone.text = "#{data.shopName}の電話番号"
  $.confirmLabel.text = "番号は\n#{data.phoneNumber}です。\n電話しますか？"
  
initFavoriteDialog = (placeID) ->
  contents = null  
  $.wantToGoIcon.addEventListener 'click', (e) ->
    animateDialog($.favoriteDialog,"show",Ti.API.info "done")
    
  $.favoriteTextArea.addEventListener 'return',(e)->
    contents = e.value
    Ti.API.info "登録しようとしてるメモの内容は is #{contents}です"
    $.favoriteTextArea.blur()

  $.favoriteTextArea.addEventListener 'blur',(e)->
    contents = e.value
    Ti.API.info "blur event fire.content is #{contents}です"

    
  $.favoriteCancelleBtn.addEventListener 'click',(e) ->
    animateDialog($.favoriteDialog, "hide","favoriteDialog cancell done")
    
  $.favoriteRegistMemoBtn.addEventListener 'click',(e) ->
    currentUserId = Ti.App.Properties.getString "currentUserId"
    $.activityIndicator.show()
    _login( (loginResult) ->
      if loginResult.success
        Cloud.Reviews.create
          rating:1
          content:contents              
          place_id:placeID
          user_id:currentUserId
          custom_fields:
            place_id:placeID
        , (result) ->
          $.activityIndicator.hide()
          if e.success
            alert "登録しました"
          else
            "すでに登録されているか\nサーバーがダウンしているために登録することができませんでした"
          animateDialog($.favoriteDialog, "hide",Ti.API.info "done")
          
      else
        alert "CraftBeerFanのサイトにログイン出来ませんでした"
        $.activityIndicator.hide()
        animateDialog($.favoriteDialog, "hide",Ti.API.info "done")
    )
initFeedBackDialog = (shopName) ->
  contents = null  
  $.feedBackIcon.addEventListener 'click', (e) ->
    animateDialog($.feedBackDialog,"show",Ti.API.info "done")        
  
  $.feedBackDialogTextArea.addEventListener 'return',(e)->
    contents = e.value
    Ti.API.info "登録しようとしてる情報は is #{contents}です"
    $.feedBackDialogTextArea.blur()
  
  $.feedBackDialogTextArea.addEventListener 'blur',(e)->
    contents = e.value
    Ti.API.info "blur event fire.content is #{contents}です"
    
  $.feedBackCancell.addEventListener 'click',(e) ->
    animateDialog($.feedBackDialog, "hide",Ti.API.info "done")
    
  $.registMemoBtn.addEventListener 'click',(e) ->
    
    $.activityIndicator.show()
    # ACSにメモを登録
    # 次のCloud.Places.queryからはaddNewIconの外側にある
    # 変数参照できないはずなのでここでローカル変数として格納しておく
    
    contents = contents
    currentUserId = Ti.App.Properties.getString "currentUserId"
    Ti.API.info "contents is #{contents} and shopName is #{shopName}"
    sendFeedBack contents,shopName,currentUserId,(result) ->
      $.activityIndicator.hide()
      if result.success
        alert "報告完了しました"
      else
        alert "サーバーがダウンしているために登録することができませんでした"
        
      animateDialog($.feedBackDialog, "hide",Ti.API.info "done")

initWebSiteDialog = (data) ->

  if typeof data.webSite isnt "undefined"
    $.webSiteInfo.text = data.webSite
  else  
    $.webSiteInfo.text = "Webサイト調査中"
    
  $.webSiteIcon.addEventListener 'click', (e) ->
    animateDialog($.webSiteDialog, "show", Ti.API.info "animation done")
  $.webSiteInfoCloseBtn.addEventListener 'click', (e) ->
    animateDialog($.webSiteDialog, "hide", Ti.API.info "animation done")
    
initShopInfoDialog = (data) ->
  # お店情報のダイアログ処理
  if typeof data.shopInfo isnt "undefined"
    $.shopInfo.text = data.shopInfo
  else
    $.shopInfo.text = "お店の詳細情報は調査中"

  $.shopInfoIcon.addEventListener 'click', (e) ->
    animateDialog($.shopInfoDialog, "show", Ti.API.info "animation done")
    
  $.feedBackCancelleBtn.addEventListener 'click', (e) ->
    animateDialog($.shopInfoDialog, "hide",Ti.API.info "animation hide")     

  
animateDialog = (dialog,flg,callback) ->        
  t1 = Titanium.UI.create2DMatrix()
  if flg is "show"
    t1 = t1.scale(1.0)    
  else  
    t1 = t1.scale(0.0)
    
  animation = Titanium.UI.createAnimation()
  animation.transform = t1
  animation.duration = 250
  dialog.animate(animation)    
  animation.addEventListener 'complete',(e) ->
    return callback

sendFeedBack = (contents,shopName,currentUserId,callback) ->
  Cloud.Emails.send
    template:'feedbackAboutShopData'
    recipients:'h5y1m141@gmail.com'
    contents:contents
    shopName:shopName
    currentUserId:currentUserId
  , (result) ->
    return callback(result)

_login = (callback) ->
  # 現在のログインIDを収得した上でユーザ情報取得する
  currentUserId = Ti.App.Properties.getString "currentUserId"
  userName = Ti.App.Properties.getString "userName"
  password = Ti.App.Properties.getString "currentUserPassword"
  loginType = Ti.App.Properties.getString "loginType"
  Ti.API.info "loginType is #{loginType}"
  if loginType is "facebook"
    fb = Alloy.Globals.Facebook
    Cloud.SocialIntegrations.externalAccountLogin
      type: "facebook"
      token:Ti.Facebook.accessToken
    , (result) ->
      return callback result
    
  else
    Cloud.Users.login
      login:userName
      password:password
    , (result) ->
      if result.success
        user = result.users[0]
        Ti.App.Properties.setString "userName","#{user.username}"
        return callback result          

