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
      
    ActivityIndicator = require('ui/android/activitiIndicator')
    @activityIndicator = new ActivityIndicator()
    @activityIndicator.hide()
    @_createTableView(data)
    @shopDataDetailWindow.add @activityIndicator
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
      
      
    shopInfoLabel = Ti.UI.createLabel
      text:shopInfo
      textAlign:'left'      
      width:"90%"
      height:'auto'
      color:@baseColor.textColor
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
      
    @tableView.setData shopData
    return @shopDataDetailWindow.add @tableView

            
  _createStatusesRows:(statuses) ->
    moment = require('lib/moment.min')
    momentja = require('lib/momentja')

    statusSection = Ti.UI.createTableViewSection
      headerTitle:"開栓情報一覧"
      

    for obj in statuses
      statusRow = Ti.UI.createTableViewRow
        width:Ti.UI.FULL
        height:'auto'
        backgroundColor:@baseColor.backgroundColor
        
      infoIcon = Ti.UI.createLabel
        top:10
        left:10
        width:"30dip"
        height:"30dip"
        color:"#ccc"
        font:
          fontSize:"28dip"
          fontFamily:'LigatureSymbols'
        text:String.fromCharCode("0xe075")
        textAlign:'center'
        
      statusLabel = Ti.UI.createLabel
        text:obj.message
        textAlign:'left'      
        width:"75%"
        height:'auto'
        color:@baseColor.textColor
        left:"50dp"
        top:"10dp"
        font:
          fontSize:"16dip"
          fontWeight:"bold"
          
      postedDateLabel = Ti.UI.createLabel
        text:moment(obj.created_at).fromNow()
        textAlign:'right'      
        width:"10%"
        height:'auto'
        color:@baseColor.textColor
        right:"5dp"
        bottom:"5dp"
        font:
          fontSize:"14dip"
          
      statusRow.add infoIcon
      statusRow.add statusLabel
      statusRow.add postedDateLabel
      statusSection.add statusRow
    return statusSection
      
module.exports = shopDataDetailWindow  
