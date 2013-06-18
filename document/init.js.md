# init.js

アプリケーションの初期化を行うモジュールです。PhoneGapがReadyになったときに呼び出されます。

## コード

https://github.com/FLECT-DEV-TEAM/phonegap-dev/tree/master/blank/ios/www/js

```javascript
onDeviceReady: function() {
    init._createTable();
},

_createTable: function() {
    // Github参照・・・
    init._startApp();
},

_startApp: function() {
    Backbone.history.start();
    router.navigate("hello", {trigger: true});
}
```

## Usage

### onDeviceReady()

外のモジュールから唯一呼び出される関数です。
PhoneGapがReadyになったときに`main.js`から呼び出されます。

ここでアプリケーションの初期化をします。(例のコードのように他の関数に任せてもよいです)

* RDBテーブル作成
* Salesforce認証
* Salesforceからマスタデータ取得

などが該当します。

初期化が終わったら`Backbone.Router`に最初のルーティングを指示します。

```javascript
Backbone.history.start();
router.navigate("hello", {trigger: true});
```
#### `router.navigate`

`#hello`にURLがハッシュチェンジします。

`router.js`定義に従って最初のルーティング処理が
行われ、アプリケーションは一番最初の画面を表示するでしょう。

```javascript
// router.js

routes: {
    "hello": "hello"
},

hello: function() {
    // 最初の画面表示！
    this.view(HelloView, "HelloView");
}
```
