class shopDataDetail
  constructor: (data) ->
    shopDataWindow = Ti.UI.createWindow
      title: "詳細情報"
      barColor:"#ccc"
      backgroundColor:"#f9f9f9"
      
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) ->
      return shopDataWindow.close({animated:true})
    )
    shopDataWindow.leftButton = backButton

      
    shopData = []  
    @section = Ti.UI.createTableViewSection
      headerTitle: ""
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
  

    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'

      
    @addressLabel = Ti.UI.createLabel
      text: ""
      width:280
      left:20
      top:10
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
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
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
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
      height:'auto'
      data:shopData
      backgroundColor:"#f3f3f3"
      separatorColor: '#cccccc'
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    @tableView.hide()

  show: () ->
    return @tableView.show()
    
  getTable:() ->
    return @tableView
    
  setData: (data) ->

    @addressLabel.setText(data.annotation.shopAddress)
    @phoneLabel.setText(data.annotation.phoneNumber)
    @callBtn.addEventListener('click',(e)->
      Titanium.Platform.openURL("tel:#{data.annotation.phoneNumber}")
    )
    @section.setHeaderTitle(data.title)
    return

      
module.exports = shopDataDetail    