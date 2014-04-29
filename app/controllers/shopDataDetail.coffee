exports.move = (_tab,shopData) ->
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
    shopInfo = "現在調査中"
    
  shopInfoRow = $.UI.create 'TableViewRow',
    classes:"shopInfoRow"
    
  shopInfoLabel = $.UI.create 'Label',
    classes:"shopInfoLabel"
    text:shopInfo
          
  shopSection = Ti.UI.createTableViewSection
    headerTitle:"お店について"
    
  shopInfoRow.add shopInfoLabel
  shopSection.add shopInfoRow unless typeof shopInfoRow is 'undefined'
  shopData.push shopSection
  
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
  
