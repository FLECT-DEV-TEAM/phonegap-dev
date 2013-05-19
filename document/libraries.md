# JavaScriptライブラリ一覧

phonegap-devで使用しているJavaScriptライブラリの一覧です。

## 構成

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/libraries.img01.png?raw=true" width="768" height="570">

# ライブラリ一覧

## OSSライブラリ

PhoneGapアプリで利用するOSSライブラリです。

|ライブラリ|バージョン|役割|備考|
|:----|:------|:------|:------|
|[jQuery](http://jquery.com/)|2.0.0|DOM操作||
|[handlebars.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/oss/handlebars.js.md)|1.0.rc1|テンプレートエンジン||
|[backbone.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/oss/backbone.js.md)|0.9.2|MVCライブラリ|underscore.jsに依存|
|[underscore.js](http://underscorejs.org/)|1.4.2|ユーティリティ||
|[forcetk.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/oss/forcetk.js.md)|-|SalesforceAPIクライアント|jQueryに依存|
|[UUID.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/oss/UUID.js.md)|3.2|BackboneモデルのID生成||
|[cordova.js](http://phonegap.com/)|2.5.0|PhoneGap基本機能||

## FlectPhoneGapライブラリ

PhoneGapアプリ開発に合わせたOSSライブラリの拡張や、オリジナルのライブラリです。

|ライブラリ|役割|備考|
|:----|:------|:------|
|[model.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/model.js.md)|MVCのモデル|Backbone.Model拡張|
|[collection.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/collection.js.md)|MVCのモデル|Backbone.Collection拡張|
|[view.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/view.js.md)|MVCのビュー/コントローラ|Backbone.View拡張|
|[router.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/controller.js.md)|コントローラのルーティング|Backbone.Router拡張|
|[handlebars-helper.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/handlebars-helper.js.md)|Handlerbarsファンクション||
|[forcetk-extend.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/forcetk-extend.js.md)|OAuth認証|forcetkの拡張|
|[transition.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/transition.js.md)|ページ遷移管理||
|[app.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/app.js.md)|アプリケーションメイン||

## PhoneGapプラグイン

PhoneGapの公式プラグインです。

iOS

- [https://github.com/phonegap/phonegap-plugins/tree/master/iOS](https://github.com/phonegap/phonegap-plugins/tree/master/iOS)

Android

- [https://github.com/phonegap/phonegap-plugins/tree/master/Android](https://github.com/phonegap/phonegap-plugins/tree/master/Android)

`cordova.js`で提供されないネイティブ機能を利用したいときに使います。利用は上記のGithubドキュメントに従ってください。

