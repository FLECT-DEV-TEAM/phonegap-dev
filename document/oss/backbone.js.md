# Backbone.js

MVCフレームワークとして`Backbone.js`を利用します。

* [http://backbonejs.org/(本家サイト)](http://backbonejs.org/)
* [https://github.com/enja-oss/Backbone(翻訳プロジェクト)](https://github.com/enja-oss/Backbone)

MVCによって、実装のパターンと責務を明確にし、保守性と品質を向上させます。

## Backboneを利用したMVCパターン

`Backbone.js`の一般的な使い方である、View-Modelオブザーバパターンを利用します。

* ControllerはViewを生成します。
* ViewはModelを生成し、Modelの状態をイベント監視します。
* Modelの状態が変わったらイベント発火するのでViewはModelから取り出したデータをDOMに反映します。

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/oss/backbone.img01.png?raw=true" width="614" height="460">

## Backboneの拡張

`Backbone.js`を拡張してPhoneGapアプリに適したライブラリを用意しています。

### Controller拡張

* [controller.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/controller.js.md)

### Model拡張

* [model.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/model.js.md)
* [collection.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/collection.js.md)

### View拡張

* [view.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/view.js.md)
