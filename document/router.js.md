# router.js

`router.js`は、URLに応じたルーティング処理を行い、モデル/コレクションを初期化して適切なコントローラを呼び出します。
`Backbone.Router`を拡張したプロトタイプ定義を継承します。ルータを表現するオブジェクトは役割上からシングルトンにします。

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/router.js

```javascript
// router.js

// プロトタイプ定義
var common = Backbone.Router.extend({

    _cache : {
        ...
    },

    view: function(viewObject, viewName, params) {
        ...
    }
})

// ルータ定義
var router = {

    Router: common.extend({

        // ルーティング設定
        routes: {
        	// "URLパターン : パターンに一致したときに呼び出す関数名" の形式で設定
            "report/:date": "list",
            "report/:id/detail": "detail",
            "report/:id/comment/*uri": "comment",
        },

        ...

        // ルーティング設定にもとづき呼び出される関数
        detail: function(id) {
            this.view(DetailView, "DetailView", id);
        },

        comment: function(reportId, imageUri) {
            this.view(CommentView, "CommentView", {
                    reportId: reportId,
                    imageUri: imageUri
                }
            );
        },

        ...

    })
}
```

## プロトタイプ定義

### _cache

ビューとトランジションのシングルトンインスタンスを格納するキャッシュです。router.jsの外から直接触ってはいけません。

### view(viewObject, viewName, params)

Backbone.Viewを継承したコントローラ/ビューコンポーネントを呼び出します。Backbone.Viewのプロトタイプ定義である`initialize()`が呼び出されます。これによって`initialize()'に記述されたコントローラ処理が実行されます。

```javascript
detail: function(id) {
    this.view(DetailView, "DetailView", id);
}
```

#### `viewObject`

呼び出すビューオブジェクトです。上記例の場合はview.jsの`DetailView#initialize`が呼び出されます。

```javascript
// view.js

・・・

// 各ビュー定義
var view = {

    DetailView : common.extend({

        // これが呼び出される
        initialize: function(id) {
            ・・・
        },
```

#### `viewName`

アプリケーション内で一意となるようなビューの名前を文字列で指定します。ルーター内にビューはキャッシュされますがそのときのキーになります。特になければオブジェクト変数名と同じにしておけば良いです。

#### `params`

viewのinitializeに渡すパラメータです。

## ルーティング定義

### routes

" __URLパターン : パターンに一致したときに呼び出す関数名__ " の形式でルーティングを設定します。
URLのハッシュが変更されて`hashchange`イベントが発火すると、ここで定義したルーティング設定に従って対応する関数が呼び出されます。

##### URLパターンのルール

* `:`で始まるパスは _パラメータ_ として扱われます 

	URL

	`#report/list/20130113`

	対応するURLパターン

	`report/list/:date`

* `*`で始まるパスは _スラッシュを含むパラメータ_ として扱われます

	URL

	`#report/123/comment/file://456.jpg`

	対応するURLパターン

	`report/:id/comment/*uri`


_パラメータ_ および _スラッシュを含むパラメータ_ は対応する関数の引数として渡されます。

