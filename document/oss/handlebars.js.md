# handlebars.js

HTMLを動的に生成するためのテンプレートエンジンです。

[http://handlebarsjs.com/](http://handlebarsjs.com/)

## テンプレートエンジン使う理由

動的にHTMLを生成する部分を、ビジネスロジックに混ぜ込んでしまうと、
ビジネスロジックがHTML構造に依存してしまい、保守しづらいコードになってしまいます。

よくある例

```javascript
// 適当です
$.ajax({
  url: "http://example.com/product/list",
  success: function (data) {
    // これがいまいち
    $.each(data.products, function(i, product) {
      $("<a/>")
       .attr("href", product.url)
       .append("<img src='" + product.image + "'/>")
       .appendTo("#list");
    });
  }
});

```

動的なHTML部分は _テンプレート化_ し、HTMLへの値のバインディングは _テンプレートエンジン_ に任せることで、
ビジネスロジックとHTML構造を出来る限り分離するのが狙いです。

## テンプレート定義

動的に表示が変わる箇所を _テンプレート_ として定義します。
_テンプレート_ はHTML内に記述します。

``` html
<!-- scriptのtypeはお約束で指定 -->
<script id="list-template" type="text/x-handlebars-template">
  
  //eachはヘルパーと呼ばれる機能で繰り返し処理をすることができる
  {{#each this}}
    
    //{{value}}がパラメータを渡すことで動的になる部分。ここだとyearとmonthとdayがパラメータになる
    <li>
      <a href="#report/{{year}}{{month}}{{day}}">{{year}}年{{month}}月{{day}}日のレポート</a>
    </li>

  {{/each}}

</script>
```

## テンプレート利用

JavaScriptのビューレイヤである`view.js`の`render()`から利用します。

```javascript
render: function() {
	
	// テンプレートに渡すJSONを作る
	// 現実的にはモデルから取得するパターンが多くなるはず
	var json = createJSON();

	// テンプレートにJSONを渡して動的にHTMLを生成
	var html = this.template("#list-template", json);

	// HTMLをDOMに追加
	$(this.el)
		.find('.append')
		.append(html);
}
```

JSONはこんな感じです。
配列になっている場合はテンプレート側の`each`で繰り返し処理が行われます。

```
createJSON : function() {
	return [
		{"year":2013,"month":"01","day":"20"}
		,{"year":2013,"month":"01","day":"21"}
		,{"year":2013,"month":"01","day":"22"}
	]
}
```

`this.template("#list-template", json)`で生成されるHTMLは以下となります。

```html
<li>
  <a href="#report/20130121">2013年01月21日のレポート</a>
</li>
<li>
  <a href="#report/20130122">2013年01月22日のレポート</a>
</li>
<li>
  <a href="#report/20130123">2013年01月23日のレポート</a>
</li>
```


## ヘルパーの自作

HTML出力内容に複雑なロジックが必要な場合は、`Handlebars.js`に用意されているヘルパーだけでは出力が難しいケースがあります。そんなときはヘルパーを自作することができます。

[handlebars-helper.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/handlebars-helper.js.md)
