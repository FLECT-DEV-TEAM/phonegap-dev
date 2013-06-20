# main.js

アプリケーションのエントリポイントとなるJavaScriptです。`RequireJS`の`data-main`で扱われるファイルです。

## コード

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/main.js

```javascript
requirejs.config({

    baseUrl: 'js',

    paths:{
        jquery: 'lib/jquery-2.0.0',
        handlebars: 'lib/handlebars',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        forcetk: 'lib/forcetk',
        uuid: 'lib/uuid'
    },

    shim: {
        "jquery": {
            exports: "jQuery"
        },
        "handlebars": {
            exports: "Handlebars"
        },
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "forcetk": {
            deps: ["jquery"],
            exports: "forcetk"
        }
    }
});

require( ['init'], function(init) {
    document.addEventListener('deviceready', init.onDeviceReady, false);
});
```

## Usage

### requirejs.config

`RequireJS`の設定を行います。詳しくはRequireJS(記述予定)を参照のこと。

### require

HTMLから唯一明示的に呼び出されるアプリケーションのエントリポイントです。

index.html

```html
<script src="js/lib/cordova.js" type="text/javascript"></script>
<script src="js/lib/require.js" data-main="js/main" type="text/javascript"></script>
```

`data-main`に指定されている`js/main`がパスを解決して`main.js`をロードします。
ロードすると`init.js`をモジュール化した後に以下が実行されます。

```javascript
// `deviceready`イベントをイベントリスナーに登録
document.addEventListener('deviceready', init.onDeviceReady, false);
```

`cordova.js`がPhoneGapの初期化を完了すると`deviceready`イベントが発火します。
よってPhoneGapが利用可能な状態になったら`init.onDeviceReady`関数が呼び出されてアプリ初期化を行うという流れになります。
