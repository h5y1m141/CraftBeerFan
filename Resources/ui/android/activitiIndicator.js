var activityIndicator;

activityIndicator = (function() {

  function activityIndicator() {
    var actInd;
    actInd = Ti.UI.createActivityIndicator({
      zIndex: 20,
      backgroundColor: "#222",
      top: 150,
      left: 120,
      height: '40dip',
      width: '200dip',
      font: {
        fontSize: '18dip',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      color: '#fff',
      message: 'loading...'
    });
    return actInd;
  }

  return activityIndicator;

})();

module.exports = activityIndicator;
