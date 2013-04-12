# view.js

`view.js`はMVCのビューを表現します。主な役割は以下となります。

* モデルおよびコレクションの変更を監視してUIに反映
* UIのイベントハンドリング

各ビューは`Backbone.View`を拡張したプロトタイプ定義を継承します。

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/view.js

``` javascript
// view.js

// プロトタイプ定義
var common = Backbone.View.extend({

	_cache : {
		template : {}
	},

	template: function(selector, params) {
		...
	},

	show : function($obj, options) {
		app.router._cache.transition.show($obj, options)
	},

	back : function() {
		return app.router._cache.transition.back();
	}

})

// 各ビュー定義
var view = {

    ClientView : common.extend({

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
            this.$el
                .find('.append')
                .append(this.template("#client-template",
                    this.clients.toJSON()));
            this.show(this.$el);
        },

        renderBack: function(e) {
            return this.back();
        }

    }),

    DestinationView : common.extend({
        ...
    })
}
```

## プロトタイプ定義

### template(selector, params)

`Handlerbars`のテンプレートをコンパイルしてDOMに追加するHTMLを生成します。

```javascript
this.$el
      .find('.append')
      .append(this.template("#client-template", json));
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

### show($obj, options)

ページを表示状態にします。現在表示されているページは自動的に非表示になります。実処理は`transition.js`の`show($obj, options)`が処理します。

```javascript
// DOMにデータを追加
this.$el
      .find('.append')
      .append(this.template("#client-template", json));

// ページを表示
this.show($el);
```


#### `$obj`

表示状態にするDOMです。通常はこのページのトップエレメントである`$el`を渡します。

#### `options`

 * `effect`

 	表示状態にするときスライドのエフェクトが不要なときはfalseにします。

 * `cleanup`

 	前のページに追加したDOMの削除が不要なときはfalseにします。

***

### back()

前のページを表示状態にします。一つ前のURLにハッシュチェンジします。実処理は`transition.js`の`back()`が処理します。

## 各ビュー定義

### el

ビューを表すエレメントです。CSSセレクタ形式で指定します。クラス`page`を指定したエレメントを指定します。

```html
<!-- ClientViewに対応するHTML -->
<div id="client-page" class="page" style="display: none;">
  <ul class="append">
  </ul>
<div>
```

```javascript
el: "#client-page"
```

---------------------------------------------------------


### $el

`el`エレメントに対応するjQueryオブジェクトのキャッシュです。UIに対する操作は`$el`を使いましょう。

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
	return this.back();
}
```

---------------------------------------------------------

### initialize

Viewの初期化を行います。

* コントローラからモデル/コレクションを受け取る
* イベントをバインドしてView内の関数に紐付ける
* ビューの初期化に必要なモデル/コレクションに対する操作

```javascript
initialize: function(clients) {
	
	// コントローラーからコレクションを受け取る
    this.clients = clients;

    // renderのコンテキスト「this」を「Backbone.View」に拘束する
    _.bindAll(this, "render", "renderBack");

    // コレクションが発火するイベントをバインドしてView内の関数に紐付ける
    this.clients.bind("add:all", this.render);

    // ビューの初期化に必要なコレクションに対する操作
    this.clients.findAll();
}
```

#### initializeは誰が呼び出す？

コントローラの`view`から呼び出されます。

```javascript
// controller.js
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
         this.view("ListView", {
                        client: new collection.Clients()
                    }
                  );
      }
}
```

---------------------------------------------------------

### render

ページのレンダリング処理を書くところです。

* jQuery.appendを利用してDOMにモデル/コレクションを反映する
* プロトタイプ定義の`show`を呼び出してページを表示状態にする

---------------------------------------------------------

### renderBack

前のページに戻るときの処理を書くところです。

```javascript
renderBack: function(e) {

    // 前ページのDOMを操作
    var text = $(e.target).html();
    $(".btn.client").text(text);

    // 前ページの表示
    // returnを書かなければならない・・・(修正したいポイント)
    return this.back();
}
```
