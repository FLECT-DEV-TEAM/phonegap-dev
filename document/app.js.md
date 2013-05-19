# app.js

アプリケーションのエントリポイントとなるメインJavaScriptです。アプリケーション全体の初期化を行います。

## コード

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/app.js

```javascript
var app = {

    setup: {
        initialize: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        onDeviceReady: function() {
            .....
        },

        startApp: function() {
            .....
        }
    }
}
```



## Usage

### initialize()

* アプリケーションのエントリポイント
* HTMLから唯一明示的に呼び出される関数

### bindEvents() 

* アプリ全体のイベントを定義する
* 少なくとも`deviceready`イベントのリスナーを登録する必要がある

#### `deviceready`イベント

`cordova.js`がPhoneGap初期化を完了したときに発火するイベントです。
よってPhoneGap初期化が終わったら`app.setup.onDeviceReady()`関数が呼び出される動きになります。

### onDeviceReady()

`deviceready`な状態なので、PhoneGapで用意された機能をここからは使うことができます。
これがないとアプリケーションが開始できないよ、という処理を書きます。

* RDBテーブル作成
* Salesforce認証

などが該当します。

```javascript
onDeviceReady: function() {

    // データベース初期化
    var db = model.database();

    db.transaction(

        // テーブル作成 CREATE TABLE IF NOT EXISTSなので初回起動時に一度だけテーブルが作られます
        function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS REPORT(id primary key, year, month, day, start, end, subject, '
                + 'visiting, client, content, sync_status, reg_time)');
            ....
            tx.executeSql('CREATE TABLE IF NOT EXISTS OAUTH(accessToken primary key, refreshToken, instanceUrl)');
        },

        // エラー処理
        function(err) {
            alert(err.code);
            alert(err.message);
        },

        // テーブル作成成功時のコールバック関数。
        function() {
            // 認証メソッドを呼び出します
            // OAuthに成功したらstartApp()がコールバックで呼び出されます
            model.forcetk().authenticate(app.setup.startApp);
        }
    );
},
```

### startApp()

アプリケーションの開始処理を書きます。

* マスタデータのロード
* `Backbone`の初期化処理

など

```javascript
startApp: function() {
    // マスタデータのロードなど
    ....

    // Backboneのコントローラを初期化
    app.router = new router.Router;

    // トランジションを初期化
    app.router._cache.transition = new Transition;
    Backbone.history.start();

    // 最初のルーティング
    app.router.navigate("report", {trigger: true});
}
```

#### `app.router.navigate`

`#report`にURLがハッシュチェンジします。

`router.js`定義に従って最初のルーティング処理が
行われ、アプリケーションは一番最初の画面を表示するでしょう。

```javascript
// router.js
Router: common.extend({

     // ルーティング定義
     routes: {
         "report": "list",
         ....
      },

      // ルーティング定義によって呼び出される関数
      list: function() {
         ....
         // 最初の画面表示！
         this.view("ListView");
      }
}
```