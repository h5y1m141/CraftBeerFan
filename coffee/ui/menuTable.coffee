class menuTable
  constructor:() ->
    @Menu = Ti.UI.createTableView
      backgroundColor:"#3f3f3f"
      separatorColor: '#cccccc'
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE      
      width:200
      height:'auto'
      left:0
      top:0
      zIndex:0
      
    @Menu.addEventListener('click',(e) ->
    ) # end of EventListener

    rows = []

    menuHeaderView = Ti.UI.createView
      backgroundColor:"#3f3f3f"
      height:30
      
    menuHeaderTitle = Ti.UI.createLabel
      top:0
      left:5
      color:'#ccc'
      font:
        fontSize:'24'
        fontFamily:"Lato-Light.ttf"
      text:'Menu'
      
    menuHeaderView.add menuHeaderTitle
    
    menuSection = Ti.UI.createTableViewSection
      headerView:menuHeaderView
      
    listRow = Ti.UI.createTableViewRow
      color:"#f3f3f3"
      height:40

    listLabel = Ti.UI.createLabel
      top:5
      left:5
      color:'#ccc'
      font:
        fontSize:'18sp'
        fontFamily:"Lato-Light.ttf"        
      text:'List'
            
    mapLabel = Ti.UI.createLabel
      top:5
      left:5
      color:'#ccc'
      font:
        fontSize:'18sp'
        fontFamily:"Lato-Light.ttf"        
      text:'Map'

      
    mapRow = Ti.UI.createTableViewRow
      color:"#f3f3f3"
      height:40
      
    mapRow.add mapLabel
    listRow.add listLabel
                
    menuSection.add listRow
    menuSection.add mapRow
    
    rows.push menuSection
    @Menu.setData rows
    # @Menu.hide()
    return

  getTable:() ->
    return @Menu
    
  show:() ->           
    return @Menu.show()

  hide:() ->           
    return @Menu.hide()

module.exports = menuTable