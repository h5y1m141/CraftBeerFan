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

    @phoneIcon = Ti.UI.createButton
      top:5
      left:10
      width:30
      height:30
      backgroundColor:"#3261AB"
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:'#fff'      
      font:
        fontSize: 32
        fontFamily:'FontAwesome'
      title:String.fromCharCode("0xf095")
      
    @phoneLabel = Ti.UI.createLabel
      text: ""
      left:50
      top:10
      width:150
      color:"#333"
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'



    reviewRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
      selectedColor:'transparent'
      
    @memoIcon = Ti.UI.createButton
      top:5
      left:10
      width:30
      height:30
      backgroundColor:"#3261AB"
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:0
      color:'#fff'      
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe08d")
      
    @memoIcon.addEventListener('click',(e) ->
      cbFan.activityIndicator.show()
      Cloud.Places.query
        page: 1
        per_page: 1
        where:{name:e.source.shopName}
      , (e) ->
        if e.success
          id = e.places[0].id
          Cloud.Reviews.create
            rating: 1
            place_id:id
            custom_fields:
              place_id:id
          , (e) ->
            cbFan.activityIndicator.hide()
            if e.success
              alert "お気に入りに登録しました"
            else  
              alert "お気に入りに登録することができませんでした"
        else
          Ti.API.info "Error:\n"
    )


    @editLabel = Ti.UI.createLabel
      top: 5
      left:10
      width: Ti.UI.SIZE
      height: Ti.UI.SIZE
      color: "#000"
      font:
        fontSize:18
        fontFamily:'Rounded M+ 1p'
      text: ''

    addressRow.add @addressLabel
    phoneRow.add @phoneIcon
    phoneRow.add @phoneLabel
    reviewRow.add @memoIcon
    reviewRow.add @editLabel
    
    shopData.push @section  
    shopData.push addressRow
    shopData.push phoneRow
    shopData.push reviewRow

    @tableView = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:200
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

    @phoneLabel.setText("電話する")
    @editLabel.setFont({fontSize: 32,fontFamily: 'LigatureSymbols'})
    shopName = data.name
    @memoIcon.shopName =  shopName
    @editLabel.setFont({fontFamily :'Rounded M+ 1p'})
    @editLabel.setText("お気に入り登録する")

    @phoneIcon.addEventListener('click',(e)->
      alert "phone icon touch"
      Titanium.Platform.openURL("tel:#{data.phoneNumber}")
    )

    
    return

      
module.exports = shopDataDetail    