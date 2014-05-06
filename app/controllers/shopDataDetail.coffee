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
  iconSection = Ti.UI.createTableViewSection
    headerTitle:"お店について"
    
  iconRow = $.UI.create 'TableViewRow',
    classes:"row"
    
  phoneIcon = $.UI.create 'Button',
    id:"phoneIcon"
    title:String.fromCharCode("0xf095")
    
  wantToGoIcon = $.UI.create 'Label',
    id:"wantToGoIcon"
    text:String.fromCharCode("0xe030")  
    
  feedBackIcon = $.UI.create 'Button',
    id:"feedBackIcon"
    title:String.fromCharCode("0xe041")
    
  webSiteIcon = $.UI.create 'Button',
    id:"webSiteIcon"
    title:String.fromCharCode("0xe13f")
    
  shopInfoIcon = $.UI.create 'Button',
    id:"shopInfoIcon"
    title:String.fromCharCode("0xe075")
    
  iconRow.add phoneIcon
  iconRow.add wantToGoIcon
  iconRow.add feedBackIcon
  iconRow.add webSiteIcon
  iconRow.add shopInfoIcon
  iconSection.add iconRow      
    
    
  if typeof data.shopInfo isnt "undefined"
    shopInfo = data.shopInfo
  else
    shopInfo = "お店の詳細情報は調査中"
    
  shopInfoRow = $.UI.create 'TableViewRow',
    classes:"row"
    
  shopInfoLabel = $.UI.create 'Label',
    classes:"shopInfoLabel"
    text:shopInfo
          
  shopInfoRow.add shopInfoLabel
  iconSection.add shopInfoRow unless typeof shopInfoRow is 'undefined'
  shopData.push iconSection

  
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
  
