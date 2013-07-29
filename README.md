# CraftBeerFan

## What's this?

最近密かになりつつあるクラフトビールが飲めるお店、ならびに、買えるお店の検索ができるiPhone/Androidアプリです。

Titanium Mobile(Titanium SDK 3.1.0.GA)にて開発しており、2013年6月28日時点では、iPhone版を中心に開発を進めてます


## アプリケーションの機能説明

### 近くのお店を検索する

- クラフトビールが飲みたくなったので、近場で飲めるお店がないか調べたい
- 行く予定のお店が決まってるが詳細の場所を確認したい

という状況を想定してこの機能を実装しました。

おそらくこの機能を使うことが多いかと思い、起動直後にこの画面が開くようになってます

![起動時の地図](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan.info/image/map01.png)

地図上にお店の場所にピンがたっており、それをタッチすることでお店の詳細情報に画面遷移します

![お店の詳細情報](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan.info/image/shopdata01.png)


### 都道府県別に確認する

出張・旅行などで土地勘のない地域に行くけど折角なのでクラフトビールが飲めるお店がどの程度あるのか事前に下調べしたいという状況を想定して実装しました。

タブをタッチすると、以下のように都道府県名のリストが標示されます

![リスト情報一覧](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan.info/image/list04.png)


任意のエリアを選択するとそのエリアに該当する都道府県名が標示されます

![都道府県表示](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan.info/image/list03.png)

東京を選択するとこのように東京都にあるお店が標示されます

![都内のお店リスト](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan.info/image/list02.png)

都内のようにお店が多数ある場合に、閲覧性に欠ける部分があるため、住所による絞り込みもできます

![都内のお店リスト](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan.info/image/list01.png)




## License

The MIT License (MIT)
Copyright (c) 2013 Hiroshi Oyamada

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

