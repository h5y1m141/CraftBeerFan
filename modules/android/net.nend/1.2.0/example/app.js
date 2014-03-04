var win = Ti.UI.createWindow({
    backgroundColor:'white'
});
win.open();

//##################################

var ad = require('net.nend');

// Banner
var adView = ad.createView({
    spotId: 3174,
    apiKey: "c5cb8bc474345961c6e7a9778c947957ed8e1e4f",
    width: '320dp',
    height: '50dp',
    bottom: '0dp',
});

// Icon
var iconsAdView = ad.createView({
    adType: 'icon',
	spotId:101282,
	apiKey:'0c734134519f25412ae9a9bff94783b81048ffbe',
	textColor:'RED',
	textHidden:false,
	// orientation:'vertical',
	orientation:'horizontal',
	top:'100dp',
});

// -------------------------------------------------

// Banner
// 受信成功通知
adView.addEventListener('receive',function(e){
    Ti.API.info('AdView receive');
});
// 受信エラー通知
adView.addEventListener('error',function(e){
    Ti.API.info('AdView error');
});
// クリック通知
adView.addEventListener('receive',function(e){
    Ti.API.info('AdView receive');
});
// 復帰通知
adView.addEventListener('dismissScreen',function(e){
    Ti.API.info('AdView dismissScreen');
});

// Icon
// 受信成功通知
iconsAdView.addEventListener('receive',function(e){
    Ti.API.info('iconsAdView receive');
});
// 受信エラー通知
iconsAdView.addEventListener('error',function(e){
    Ti.API.info('iconsAdView error');
});
// クリック通知
iconsAdView.addEventListener('receive',function(e){
    Ti.API.info('iconsAdView receive');
});

// -------------------------------------------------

var btnLayout = Ti.UI.createView({
    layout: 'horizontal',
});

// 広告リロード停止ボタン
var pauseBtn = Ti.UI.createButton({
   title: 'pause', 
   width: '50%'
});
pauseBtn.addEventListener('click', function(e) {
    adView.pause();
    iconsAdView.pause();
});

// 広告リロード再開ボタン
var resumeBtn = Ti.UI.createButton({
   title: 'resume', 
   width: '50%'
});
resumeBtn.addEventListener('click', function(e) {
    adView.resume();
    iconsAdView.resume();
});

//##################################

btnLayout.add(pauseBtn);
btnLayout.add(resumeBtn);
win.add(btnLayout);

win.add(adView);
win.add(iconsAdView);
