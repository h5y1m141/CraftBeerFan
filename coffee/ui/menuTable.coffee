class menuTable
  constructor:() ->
    @Menu = Ti.UI.createTableView
      backgroundColor:"#3f3f3f"
      separatorColor: '#cccccc'
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
      width:"150sp"
      height:'auto'
      left:0
      top:0
      zIndex:20
      
    @Menu.addEventListener('click',(e) ->
    ) # end of EventListener

    rows = []

    menuSection = Ti.UI.createTableViewSection
      title:"Menu"
      
    listRow = Ti.UI.createTableViewRow
      title:"List"
      color:"#f3f3f3"
      
    mapRow = Ti.UI.createTableViewRow
      title:"表示"    
      color:"#f3f3f3"
      
    menuSection.add listRow
    menuSection.add mapRow
    
    rows.push menuSection
    @Menu.setData rows
    @Menu.hide()
    return

  getTable:() ->
    return @Menu
    
  show:() ->           
    return @Menu.show()

module.exports = menuTable