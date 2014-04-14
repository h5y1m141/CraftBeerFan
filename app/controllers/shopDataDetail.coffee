exports.move = (_tab,shopData) ->
  _tab.open $.shopDataDetail
  _createTableView shopData
  
_createTableView = (data) ->
  shopData = []
    
  if typeof data.shopInfo isnt "undefined"
    shopInfo = data.shopInfo
  else
    shopInfo = "現在調査中"
    
  shopInfoRow = Ti.UI.createTableViewRow
    width:'auto'
    height:'auto'
    
    
  shopInfoLabel = Ti.UI.createLabel
    text:shopInfo
    textAlign:'left'      
    width:"90%"
    height:'auto'
    left:"10dp"
    top:"10dp"
    font:
      fontSize:"18dip"
      fontWeight:'bold'          
  shopSection = Ti.UI.createTableViewSection
    headerTitle:"お店について"
    
  shopInfoRow.add shopInfoLabel
  shopSection.add shopInfoRow unless typeof shopInfoRow is 'undefined'
  shopData.push shopSection
  
  if data.statuses.length isnt 0
    Ti.API.info "create statuses data.statuses is #{data.statuses}"
    statusesRows = @_createStatusesRows(data.statuses)
    shopData.push statusesRows
    
  $.tableview.setData shopData
