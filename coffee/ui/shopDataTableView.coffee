class shopDataTableView
  constructor: () ->
    prefectures = [
      {"name":"北海道","area":"北海道・東北"},
      {"name":"青森県","area":"北海道・東北"},
      {"name":"岩手県","area":"北海道・東北"},
      {"name":"宮城県","area":"北海道・東北"},
      {"name":"秋田県","area":"北海道・東北"},
      {"name":"山形県","area":"北海道・東北"},
      {"name":"福島県","area":"北海道・東北"},
      {"name":"茨城県","area":"関東"},
      {"name":"栃木県","area":"関東"},
      {"name":"群馬県","area":"関東"},
      {"name":"埼玉県","area":"関東"},
      {"name":"千葉県","area":"関東"},
      {"name":"東京都","area":"関東"},
      {"name":"神奈川県","area":"関東"},
      {"name":"新潟県","area":"中部"},
      {"name":"富山県","area":"中部"},
      {"name":"石川県","area":"中部"},
      {"name":"福井県","area":"中部"},
      {"name":"山梨県","area":"中部"},
      {"name":"長野県","area":"中部"},
      {"name":"岐阜県","area":"中部"},
      {"name":"静岡県","area":"中部"},
      {"name":"愛知県","area":"中部"},
      {"name":"三重県","area":"近畿"},
      {"name":"滋賀県","area":"近畿"},
      {"name":"京都府","area":"近畿"},
      {"name":"大阪府","area":"近畿"},
      {"name":"兵庫県","area":"近畿"},
      {"name":"奈良県","area":"近畿"},
      {"name":"和歌山県","area":"近畿"},
      {"name":"鳥取県","area":"中国・四国"},
      {"name":"島根県","area":"中国・四国"},
      {"name":"岡山県","area":"中国・四国"},
      {"name":"広島県","area":"中国・四国"},
      {"name":"山口県","area":"中国・四国"},
      {"name":"徳島県","area":"中国・四国"},
      {"name":"香川県","area":"中国・四国"},
      {"name":"愛媛県","area":"中国・四国"},
      {"name":"高知県","area":"中国・四国"},
      {"name":"福岡県","area":"九州・沖縄"},
      {"name":"佐賀県","area":"九州・沖縄"},
      {"name":"長崎県","area":"九州・沖縄"},
      {"name":"熊本県","area":"九州・沖縄"},
      {"name":"大分県","area":"九州・沖縄"},
      {"name":"宮崎県","area":"九州・沖縄"},
      {"name":"鹿児島県","area":"九州・沖縄"},
      {"name":"沖縄県","area":"九州・沖縄"}      
    ]
    @table = Ti.UI.createTableView
      backgroundColor:'#fff'
      separatorColor: '#ccc'
      width:320
      height:'auto'
      left:0
      top:0
      
    colorSet = [
      color: "#fff"
      position: 0.0
    ,
      color: "#eee"
      position: 0.3
    ,
      color: "#ededed"
      position: 1.0
    ]      
    
    
    @table.addEventListener('click',(e) =>

    )
    rows = []
    PrefectureCategory = @_makePrefectureCategory prefectures

    
    # for categoryName of PrefectureCategory
    #   alert categoryName
    #   Ti.API.info PrefectureCategory[categoryName].length
      
    for categoryName of PrefectureCategory
      textLabel = Ti.UI.createLabel
        width:240
        height:20
        top:5
        left:5
        color:'#222'
        font:
          fontSize:16
          fontWeight:'bold'
        text:categoryName

      if Titanium.Platform.osname is "iphone"
        row = Ti.UI.createTableViewRow
          width:'auto'
          height:40
          borderWidth:0
          className:'shopData'
          backgroundGradient: 
            type: 'linear'
            startPoint: 
              x: '0%',
              y: '0%'
            ,
            endPoint: 
              x: '0%'
              y: '100%'
            ,
            colors: colorSet
        row.add textLabel
      else if Titanium.Platform.osname is "android"
        row = Ti.UI.createTableViewRow
          width:'auto'
          height:40
          className:'shopData'
        view = Ti.UI.createView
          width:'auto'
          height:40
          backgroundGradient: 
            type: 'linear'
            startPoint: 
              x: '0%',
              y: '0%'
            ,
            endPoint: 
              x: '0%'
              y: '100%'
            ,
            colors: colorSet
        view.add textLabel   
        row.add view
      else
        Ti.API.info 'no data'

      
      rows.push row
      
    @table.setData rows
    
    return @table

  # 都道府県のリスト情報から日本の地域ｘ都道府県名の以下の様なリストを作成する
  # "北海道・東北":[ {},{} ],
  # "関東":[{},]
  # :

  _makePrefectureCategory: (data) ->
    _ =  require("lib/underscore-1.4.3.min")
    result = _.groupBy(data,(row) ->
      return row.area
    )
    return result
    
module.exports = shopDataTableView


