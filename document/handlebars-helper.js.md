# handlebars-helper.js

Handlebarsには _ヘルパー_ という機能があります。テンプレートからHTMLを出力するときに任意のファンクションを実行する機能です。

`each`などデフォルトで用意されたヘルパーを使える他、自作の独自ヘルパーを定義することができます。独自ヘルパーは`handlebars-helper.js`に定義してください。

## 独自ヘルパーが効果的なパターン

モデルのステートによってHTMLの出しわけが必要なときに独自ヘルパーを使うと便利になります。

出し分けのためのロジックをViewの`render()`に書いてしまうと、ビューロジックの中にHTML構造が入ってきてしまいます。
そこでテンプレートエンジンのヘルパーが仲介に入り、HTMLの出し分け処理を行います。JSPのタグリブ、Railsのヘルパーと同じような位置づけのものと考えるのがよいでしょう。

## 独自ヘルパー定義

以下のようなことを実現するヘルパー定義の例です

* ページング処理が必要
* 現在のページ数によってヘッダ部分のHTMLの出しわけが必要

```javascript
Handlebars.registerHelper('picturePaging', function(param) {

	// ヘルパーが最終的に返却するHTML
	var html = '<h5 class="muted">'

	// 現在のページ
	var page = Number(param.page);

	// 総ページ数
	var pageCount = Number(param.pageCount);

	var reportId = param.reportId;

	// 一番最初のページだった場合は「戻る」ボタン
	if (page === 0) {
		html = html + '<span class="label label-info back"><a href="#back">戻る</a></span>';

	// そうでなければ「前の写真」ボタン
	} else {
		html = html + '<span class="label label-info back"><a href="#back">前の写真</a></span>';
	}

	// ヘッダのタイトル
	html = html + '写真をみる';

	// 一番最後のページでなければ「次の写真」
	if (page !== pageCount - 1) {
		html = html + '<span class="label label-info next"><a href="#report/' + reportId + '';
		html = html + '/picture/' + (page + 1) +'">次の写真</a></span>';
	}
	html = html + '</h5>';

    // HTML文字列を返却
	return new Handlebars.SafeString(html);
});
```

### `registerHelper(name, fn)`

ヘルパーを登録します。

#### `name`

ヘルパーの名前です。テンプレートからヘルパーを呼び出す時はこの名前で呼び出します。

#### `fn`

実行するファンクションです。


## 独自ヘルパーの利用

HTMLには以下のようにHandlebarsテンプレートを記述します。

```html
<script id="picture-detail-header-template" type="text/x-handlebars-template">

    {{#picturePaging this}}{{page}} {{pageCount}} {{reportId}}{{/picturePaging}}

</script>
```

`view.js`からは通常のHandlebarsテンプレートと同様に`template`メソッドで扱うことができます。

```javascript
PictureView : common.extend({

    render: function() {
        this.$el
        .find(".navbar-inner")
        .find(".append")
        .append(this.template("#picture-detail-header-template", {
            "page": this.page,
            "pageCount" : this.pictures.length,
            "reportId": this.reportId //123
    }));

)}
```

たとえばページが最初のページだったら以下のようなHTMLが生成されるでしょう。

```html
<h5 class="muted">
  <span class="label label-info back"><a href="#back">戻る</a></span>
  <span class="label label-info next"><a href="#report/123/picture/1">次の写真</a></span>
</h5>
```
