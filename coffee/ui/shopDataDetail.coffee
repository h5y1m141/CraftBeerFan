class shopDataDetail
  constructor: (data) ->
      
    shopData = []
    

    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'

      
    @addressLabel = Ti.UI.createLabel
      text: ""
      width:280
      color:"#333"
      left:20
      top:10
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
    
    phoneRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
    
    @phoneLabel = Ti.UI.createLabel
      text: ""
      left:20
      top:10
      width:150
      color:"#333"
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'

    @callBtn = Ti.UI.createButton
      title:'call'
      width:50
      height:25
      left:180
      top:10
      
    
    addressRow.add @addressLabel
    phoneRow.add @phoneLabel
    phoneRow.add @callBtn
    
    shopData.push @section  
    shopData.push addressRow
    shopData.push phoneRow

    @tableView = Ti.UI.createTableView
      width:'auto'
      height:80
      top:10
      left:0
      data:shopData
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      borderRadius:5

    @tableView.hide()

  show: () ->
    return @tableView.show()
    
  getTable:() ->
    return @tableView
    
  setData: (data) ->
    Ti.API.info data.annotation.phoneNumber
    @addressLabel.setText(data.annotation.shopAddress)
    @phoneLabel.setText(data.annotation.phoneNumber)
    @callBtn.addEventListener('click',(e)->
      Titanium.Platform.openURL("tel:#{data.annotation.phoneNumber}")
    )
    
    return

      
module.exports = shopDataDetail    