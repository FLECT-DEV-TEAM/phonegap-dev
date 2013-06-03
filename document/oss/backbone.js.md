# Backbone.js

MVCフレームワークとして`Backbone.js`を利用します。

* [http://backbonejs.org/(本家サイト)](http://backbonejs.org/)
* [https://github.com/enja-oss/Backbone(翻訳プロジェクト)](https://github.com/enja-oss/Backbone)

MVCによって、実装のパターンと責務を明確にし、保守性と品質を向上させます。

## Backboneを利用したMVCパターン

`Backbone.js`の一般的な使い方である、イベントを利用したオブザーバパターンを採用します。

* UI上のイベントが発生するとRouter経由、もしくは直接Controllerが呼び出されます
* ControllerはModelを生成してイベントをバインドした後Modelを操作します。
* Controllerのモデル操作によりModelの状態が変更されるとViewに変更が通知されます。
* 変更通知を受けたViewはModelから取り出したデータをDOMに反映します。

ViewとModelはイベントによる結びつきにとどめ直接操作しないようにします。
これによりModelがViewに依存しない作りになりビジネスロジックのテストや再利用が行いやすくなります。

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/oss/backbone.img01.png?raw=true" width="614" height="460">

## Backboneの拡張

`Backbone.js`を拡張してPhoneGapアプリに適したライブラリを用意しています。

### Backbone.Router拡張

* [router.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/router.js.md)

### Backbone.Model拡張

* [model.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/common-model.js.md)

### Backbone.Collection拡張

* [collection.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/common-collection.js.md)

### Backbone.View拡張

* [view.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/common-view.js.md)
