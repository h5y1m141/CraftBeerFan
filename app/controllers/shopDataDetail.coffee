
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
    
    
  if typeof data.shopInfo isnt "undefined"
    shopInfo = data.shopInfo
  else
    shopInfo = "お店の詳細情報は調査中"
    
  # shopInfoRow = $.UI.create 'TableViewRow',
  #   classes:"row"
    
  # shopInfoLabel = $.UI.create 'Label',
  #   classes:"shopInfoLabel"
  #   text:shopInfo
          
  # shopInfoRow.add shopInfoLabel
  # iconSection.add shopInfoRow unless typeof shopInfoRow is 'undefined'
  # shopData.push iconSection

  
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
  $.phoneIcon.addEventListener 'click', (e) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(1.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return $.phoneDialog.animate(animation)
    
  $.wantToGoIcon.addEventListener 'click', (e) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(1.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return $.favoriteDialog.animate(animation)
    
  $.feedBackIcon.addEventListener 'click', (e) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(1.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return $.feedBackDialog.animate(animation)    
    
    
  $.callBtn.addEventListener 'click',(e) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    $.phoneDialog.animate(animation)
    
    animation.addEventListener('complete',(e) ->
      Titanium.Platform.openURL("tel:#{data.phoneNumber}")
    )    
    
  $.cancelleBtn.addEventListener 'click',(e) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    $.phoneDialog.animate(animation)
    animation.addEventListener('complete',(e) ->
      Ti.API.info "cancelleBtn hide"
    )    
  $.titleForPhone.text = "#{data.shopName}の電話番号"
  $.confirmLabel.text = "番号は\n#{data.phoneNumber}です。\n電話しますか？"
  contents = null
  
  $.feedBackDialogTextArea.addEventListener 'return',(e)->
    contents = e.value
    Ti.API.info "登録しようとしてる情報は is #{contents}です"
    textArea.blur()

  
  $.feedBackDialogTextArea.addEventListener 'blur',(e)->
    contents = e.value
    Ti.API.info "blur event fire.content is #{contents}です"

  $.registMemoBtn.addEventListener 'click',(e) =>
    $.activityIndicator.show()
    # ACSにメモを登録
    # 次のCloud.Places.queryからはaddNewIconの外側にある
    # 変数参照できないはずなのでここでローカル変数として格納しておく
    
    contents = contents
    currentUserId = Ti.App.Properties.getString "currentUserId"
    Ti.API.info "contents is #{contents} and shopName is #{shopName}"
    # sendFeedBack(contents,shopName,currentUserId,(result) =>
    #   that.activityIndicator.hide()
    #   if result.success
    #     alert "報告完了しました"
    #   else
    #     alert "サーバーがダウンしているために登録することができませんでした"
    #   that._hideDialog(_view,Ti.API.info "done")

    # )

  $.feedBackCancelleBtn.addEventListener 'click',(e) =>
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    $.feedBackDialog.animate(animation)
    animation.addEventListener('complete',(e) ->
      Ti.API.info "feedBackCancelleBtn done"
    )    
    


  $.favoriteCancelleBtn.addEventListener 'click',(e) =>
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    $.favoriteDialog.animate(animation)
    animation.addEventListener('complete',(e) ->
      Ti.API.info "favoriteDialog cancell done"
    )    
    
