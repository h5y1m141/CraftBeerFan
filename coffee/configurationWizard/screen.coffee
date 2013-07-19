class screen
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor
      
    winTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:"#333"
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"CraftBeerFan"
    
    @win = Ti.UI.createWindow
      title:"CraftBeerFan"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
    if Ti.Platform.osname is 'iphone'
      @win.setTitleControl winTitle
      
    @label = Ti.UI.createLabel
      textAlign:1
      color:"#222"
      width:300
      font: 
        fontFamily:'Helvetica Neue'
        fontSize:14
        fontWeight:'bold'
      height:80
      top:50
      left:5
      

    @startPointBtn = Ti.UI.createButton
      width:50
      height:30
      top:50
      left:10
      color:"#222"

    @backBtn = Ti.UI.createButton
      width:50
      height:30
      top:50
      left:60
      color:"#222"
      
    @nextBtn = Ti.UI.createButton
      width:50
      height:30
      top:50
      left:110
      color:"#222"

            

    @endPointBtn = Ti.UI.createButton
      width:50
      height:30
      top:50
      left:160
      color:"#222"

      
      
    @currentView = Ti.UI.createView
      width:300
      height:300
      backgroundColor:'#ededed'
      top:120
      left:10
      zIndex:1
      borderRadius:10
      
    
    @nextView = Ti.UI.createView
      width:300
      height:300
      backgroundColor:"#ccc"
      top:120
      left:120
      zIndex:2
      visible:false
      borderRadius:5

    @nextViewlabel = Ti.UI.createLabel
      textAlign:1
      color:"#222"
      width:300
      font: 
        fontFamily:'Helvetica Neue'
        fontSize:14
        fontWeight:'bold'
      height:80
      top:50
      left:5


module.exports = screen