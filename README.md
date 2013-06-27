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

![起動時の画面](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan/mainMap.jpg)

地図上にお店の場所にピンがたっており、それをタッチすることでお店の詳細情報に画面遷移します

![起動時の画面](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan/shopDetail.jpg)


### 都道府県別に確認する

こちらの機能については出張・旅行などで土地勘のない地域に行くけど折角なのでクラフトビールが飲めるお店がどの程度あるのか事前に下調べしたいという状況を想定して実装しました。

タブをタッチすると、以下のように都道府県名のリストが標示されます
![起動時の画面](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan/areList.jpg)



任意の都道府県を選択するとその地域のお店情報がリスト表示されます

![起動時の画面](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan/shopList.jpg)

任意のお店をタッチすることで詳細情報に画面遷移します

![起動時の画面](https://s3-ap-northeast-1.amazonaws.com/craftbeer-fan/shopDetail.jpg)




## License

The MIT License (MIT)
Copyright (c) 2013 Hiroshi Oyamada

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

