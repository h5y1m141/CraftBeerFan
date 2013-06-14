class shopDataDetail
  constructor: (data) ->
    shopDataWindow = Ti.UI.createWindow
      title: "詳細情報"
      barColor:"#DD9F00"
      backgroundColor: "#343434"
      
    shopData = []  
    @section = Ti.UI.createTableViewSection
      headerTitle: data.title

    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40

      
    @addressLabel = Ti.UI.createLabel
      text: data.annotation.shopAddress
      width:280
      left:20
      top:10
    
    phoneRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
    
    @phoneLabel = Ti.UI.createLabel
      text: data.annotation.phoneNumber
      left:20
      top:10
      width:120

    @callBtn = Ti.UI.createButton
      title:'電話する'
      width:100
      height:25
      left:150
      top:10
      phoneNumber:""
      
    @callBtn.addEventListener('click',(e)->
      Titanium.Platform.openURL("tel:#{data.annotation.phoneNumber}")
    )
    
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
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED

    return @tableView

module.exports = shopDataDetail    