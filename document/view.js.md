# view.js

`view.js`はMVCのビューおよびコントローラの共通処理を実装したモジュールです。各ビュー/コントローラは`CommonView`を継承して実装します。

* コントローラとしての役割
 * UIイベントおよびモデル変更によるイベントのハンドリング

* ビューとしての役割
 * DOMツリーを構築しUIを提供する

`view.js`なのにコントローラ？と思われるかもしれませんが、`Backbone.View`がコントローラとビュー役割を担うことになっているので、それに準ずることにします。

実装はコントローラの役割を担当する _コントローラメソッド_ と ビューの役割を担当する _ビューメソッド_ とに大別されます。

view.js

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/view.js

``` javascript
var CommonView = Backbone.View.extend({

	_cache : {
		template : {}
	},

	template: function(selector, params) {
		...
	}

})
```

各ビュー/コントローラ定義の例

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/view/hello-view.js

hello-view.js

```javascript
define(['view'], function(CommonView) {

    return CommonView.extend({

        el: "#client-page",

        events: {
            "click a" : "renderBack"
        },

        initialize: function(clients) {
            _.bindAll(this, "render", "renderBack");
            this.clients = clients;
            this.clients.bind("add:all", this.render);
            this.clients.findAll();
        },

        render: function() {
            $(this.template(
                "#client-template",
                this.clients.toJSON())
              ).slide();
        },

        renderBack: function(e) {
            router.navigate("top", {trigger: true});
        }

    }),

    DestinationView : common.extend({
        ...
    })
}
```

## CommonView定義

### template(selector, params)

`Handlerbars`のテンプレートをコンパイルしてDOMに追加するHTMLを生成するビューメソッドです。

```javascript
var page = this.template("#client-template", json);
```

テンプレートはHTMLに以下のように定義しておきます。

```html
<script id="client-template" type="text/x-handlebars-template">
  {{#each this}}
	<li><a href="#back">{{name}}</a></li>
  {{/each}}
</script>
```

#### `selector`

`Handlebars`テンプレートを取得するためのCSSセレクタ。

#### `params`

`Handlebars`テンプレートがHTMLを生成する(`Handlebars#compile`)時に渡すパラメータ。

---------------------------------------------------------

### $el

`el`エレメントに対応するjQueryオブジェクトのキャッシュです。_ビューメソッド_ からUI構築のため利用されます。

---------------------------------------------------------

### events

ビュー内で発生するイベントです。ボタンがクリックされたときなどのUIイベントを定義します。
`"event selector" : "callback"`の形式で記述をします。

```javascript

// aタグがクリックされたらrenderBackが呼び出されます
events: {
	"click a" : "renderBack"
},

// e.targetにセレクタが格納される
renderBack: function(e) {
	var text = $(e.target).html();
	$(".btn.client").text(text);
	router.navigate("top", {trigger: true});
}
```

---------------------------------------------------------

### initialize

Viewの初期化を行います。_コントローラメソッド_ として扱います。

* モデル/コレクションが発行するイベントをView内の _ビューメソッド_ にひもづける定義
* View初期処理として必要なモデル/コレクションに対する操作

```javascript
initialize: function(clients) {
	
    this.clients = clients;

    // renderのコンテキスト「this」を「Backbone.View」に束縛する
    _.bindAll(this, "render", "renderBack");

    // コレクションが発行するイベントをビューメソッドに紐付ける
    this.clients.bind("add:all", this.render);

    // ビューの初期化に必要なコレクションに対する操作
    this.clients.findAll();
}
```

#### initializeは誰が呼び出す？

ルータの`view`メソッドが呼び出します。

```javascript
// router.js
Router: common.extend({

     // ルーティング定義
     routes: {
         "client": "client",
         ....
      },

      // ルーティング定義によって呼び出される関数
      client: function() {
         ....
         // view関数内でnew ListView()　=> ListView#initialize()が呼び出される
         this.view(ListView, "ListView");

      }
}
```

---------------------------------------------------------

### render

ページのレンダリング処理を記述する _ビューメソッド_ です。
以下の処理を記述します。

* `CommonView#template`を呼び出して表示するHTMLを生成する
* HTMLをjQueryオブジェクト化して$.slide();を呼び出し画面遷移させる

---------------------------------------------------------
