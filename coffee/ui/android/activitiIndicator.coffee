class activityIndicator
  constructor: () ->
    actInd = Ti.UI.Android.createProgressIndicator
      zIndex:20
      backgroundColor:"#222"
      top:150
      left:120
      height:'40dip'
      width:'200dip'
      font:
        fontSize:'18dip'
      color: '#fff'
      message: 'loading...'
    return actInd
  
module.exports = activityIndicator  