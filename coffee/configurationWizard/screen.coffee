class screen
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      color:"#333"
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
      color:@baseColor.color
      width:300
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      height:80
      top:50
      left:5
      
    @backBtn = Ti.UI.createLabel
      color:"#333"
      width:40
      height:120
      top:50
      left:30
      font:
        fontSize:32
        fontFamily : 'Rounded M+ 1p'
      text:"<"
      
      # font:
      #   fontSize: 32
      #   fontFamily:'LigatureSymbols'
      # text:String.fromCharCode("0xe080")
      
    @nextBtn = Ti.UI.createLabel
      color:"#333"
      width:40
      height:120
      top:50
      right:30
      font:
        fontSize:32
        fontFamily : 'Rounded M+ 1p'

      text:">"
      
      # font:
      #   fontSize: 32
      #   fontFamily:'LigatureSymbols'
      # text:String.fromCharCode("0xe112")

            

    @endPointBtn = Ti.UI.createLabel
      color:@baseColor.barColor
      backgroundColor:"#DA5019"
      width:150
      height:50
      top:150
      textAlign:"center"
      left:75
      borderWidth:0
      borderRadius:10
      font:
        fontSize:24
        fontFamily : 'Rounded M+ 1p'
      text:"START"

    @endPointBtn.addEventListener('click',(e)->
      Ti.App.Properties.setBool "configurationWizard", false
      mainController = require("controller/mainController")
      new mainController()
    )    
      
    @currentView = Ti.UI.createView
      width:300
      height:300
      backgroundColor:@baseColor.backgroundColor
      top:120
      left:10
      zIndex:1
      borderRadius:10
      
    
    @nextView = Ti.UI.createView
      width:300
      height:300
      backgroundColor:@baseColor.backgroundColor
      top:120
      left:120
      zIndex:2
      visible:false
      borderRadius:5

    @nextViewlabel = Ti.UI.createLabel
      textAlign:1
      color:@baseColor.color
      width:300
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      height:80
      top:50
      left:5


module.exports = screen