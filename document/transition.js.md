# transition.js

画面遷移をコントロールするモジュールです。

*  画面の表示/非表示制御

	CSSの`display`を切り替えて前画面を非表示にしつつ次画面を表示させます。`CSS transition`によるネイティブっぽい遷移エフェクトも同時に行います。

* 履歴管理

	履歴管理によって「戻る」ができるようにします。

* DOMのお掃除

	前画面を非表示にするときに動的に追加したDOMをお掃除します。

`transiton.js` _の関数は基本的には開発者がアプリから直接よびだすことはありません。_ viewにプロトタイプ定義されている`show`、`back`経由で呼び出される想定です。

## 初期化

アプリケーションの初期化を行う`app.js`の中で`Transition`を初期化します。初期化した`Transition`のインスタンスは`controller.Router()`の中にシングルトンインスタンスとしてキャッシュします。

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/app.js

```javascript
// app.js

var app = {

    setup: {

        ...

        startApp: function() {

            // コントローラの初期化
            app.router = new controller.Router();

            // トランジションを初期化してコントローラの中にキャッシュ
            app.router._cache.transition = new Transition();
        }
    }
};
```

## 関数定義

### show($obj, options)

画面遷移をするための処理を行います。`view.js`の`show($obj, options)`経由で呼び出されます。

* 次に表示させる画面を表示状態にします
* 前画面を非表示状態にします
* 前画面のクラス「append」に動的に追加されたDOMを削除します
* 前画面から次に表示させる画面にスクロールします

### back()

前の画面に戻るための処理を行います。`view.js`の`render()`経由で呼び出されます。

* 履歴に残っている一つ前の画面のURLハッシュに変更します
* ハッシュが変わることにより`Backbone`のルータが一つ前の画面を再表示します
