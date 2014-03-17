class shopDataDetailWindow
  constructor:(data)->

    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:"#f3f3f3"
      keyColor:"#DA5019"
      textColor:"#333"
      phoneColor:"#3261AB"
      favoriteColor:"#DA5019"
      starColor:"#DA5019"
      separatorColor:'#cccccc'

    
    @shopDataDetailWindow = Ti.UI.createWindow
      title:"#{data.shopName}"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      

    @_createTableView(data)
    return @shopDataDetailWindow
    
    
    
  _createTableView:(data) ->
    shopData = []
    

      
    wantToGoRow = Ti.UI.createTableViewRow
      width:'auto'
      height:'40dip'
      selectedColor:'transparent'
      rowID:2
      shopName:"#{data.shopName}"
      
      

    @tableView = Ti.UI.createTableView
      width:Ti.UI.FULL
      top:0
      left:0
      data:shopData
      backgroundColor:@baseColor.backgroundColor
      separatorColor:@baseColor.separatorColor
      borderRadius:5
      
    @tableView.addEventListener('click',(e) =>

    )
    if typeof data.shopInfo isnt "undefined"
      shopInfo = data.shopInfo
    else
      shopInfo = "現在調査中"
      
    shopInfoRow = Ti.UI.createTableViewRow
      width:'auto'
      height:'auto'
      
    shopInfoIcon = Ti.UI.createLabel
      top:10
      left:10
      width:"40dip"
      height:"40dip"
      color:"#ccc"
      font:
        fontSize:"36dip"
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe075")
      textAlign:'center'
      
    shopInfoLabel = Ti.UI.createLabel
      text:shopInfo
      textAlign:'left'      
      width:"250dip"
      height:'auto'
      color:@baseColor.textColor
      left:100
      top:10
      font:
        fontSize:"18dip"
        fontWeight:'bold'          
        
    shopInfoRow.add shopInfoLabel
    shopInfoRow.add shopInfoIcon
    shopData.push shopInfoRow unless typeof shopInfoRow is 'undefined'
    
    if data.statuses.length isnt 0
      Ti.API.info "create statuses data.statuses is #{data.statuses}"
      statusesRows = @_createStatusesRows(data.statuses)
      for row in statusesRows
        shopData.push row
      
    @tableView.setData shopData
    return @shopDataDetailWindow.add @tableView
            
  _createStatusesRows:(statuses) ->
    rows = []
    for obj in statuses
      statusRow = Ti.UI.createTableViewRow
        width:Ti.UI.FULL
        height:'auto'
        backgroundColor:@baseColor.backgroundColor
        
      statusLabel = Ti.UI.createLabel
        text:obj.message
        textAlign:'left'      
        width:"300dip"
        height:'auto'
        color:@baseColor.textColor
        left:"10dp"
        top:"10dp"
        font:
          fontSize:"16dip"
          
      statusRow.add statusLabel
      rows.push statusRow
      
    return rows
      
module.exports = shopDataDetailWindow  
