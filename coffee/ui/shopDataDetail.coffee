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
      
    # お店のreview情報が存在するようだったら画面に表示する

    Cloud.Reviews.query
      page: 1
      per_page: 20
      place_id:"51cb8b0377b5c90acd0a0bb2"
    , (e) ->
      if e.success
        i = 0
        while i < e.reviews.length
          review = e.reviews[i]
          alert "id: " + review.id + "\n" + "id: " + review.id + "\n" + "rating: " + review.rating + "\n" + "content: " + review.content + "\n" + "updated_at: " + review.updated_at
          i++
      else
        alert "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
    
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
    @addressLabel.setText(data.shopAddress)
    @phoneLabel.setText(data.phoneNumber)
    @callBtn.addEventListener('click',(e)->
      Titanium.Platform.openURL("tel:#{data.annotation.phoneNumber}")
    )
    
    return

      
module.exports = shopDataDetail    