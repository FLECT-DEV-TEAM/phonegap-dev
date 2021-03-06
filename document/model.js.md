# model.js

`model.js`はMVCのモデルの共通処理を実装したモジュールです。各モデルは`CommonModel`を継承したモデルを実装します。

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/model.js

CommonModel.js

```javascript

var CommonModel = Backbone.Model.extend({

    initialize: function(obj) {
      ...
    },

    save: function(callback, options) {
      ...
    },

    sync: function(success, failure) {
      ...
    },

    query: function(sql, params) {
      ...
    }
})
```

各モデル定義の例

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/model/hello-model.js

hello-model.js

```javascript
define(['model'], function(CommonModel) {

    return CommonModel.extend({
        tableName : "HELLO",
        sfObjectName : "Hello__c",
        sfRecordName : "name"
    }, {
        ddl: "CREATE TABLE IF NOT EXISTS HELLO(id primary key, name)"
    });

});
```

## CommonModel定義

### initialize(attributes, options)

`new `すると呼び出される関数です。
`attributes`で初期化します。

```javascript
var report = new Report({
	"year" : date.year,
	"month" : date.month,
	"day" : date.day,
	"subject" : $('#subject').val(),
	"content" : $('#content').val()
});
```

上記の例のように`id`属性を指定しない場合は自動的にID(UUIDv4)が発番されます。
(ただし`options`でnoIdをfalseにした場合は例外)

#### `attributes`

モデルの属性。プロパティ名はRDBのカラムと同じ名前にします。

#### `options`

この関数のオプション動作をオブジェクトで指定します。

* `noId`

    trueにするとIDの自動発番は行われません。

---------------------------------------------------------

### query(sql, params)

RDB検索をしデータを取得します。

* 取得した結果はモデルにバインドされます
* 結果がモデルにバインドされた時に`change`イベントが発火します
 * `change`イベントは`View`で監視してモデルの変更をUIに反映します
* 結果が0件だった場合は`notfound`イベントが発火します

```javascript

// view.js

initialize : function (report) {

    // renderのコンテキスト「this」を「Backbone.View」に拘束する
    _.bindAll(this, 'render');

    // モデル「report」に「change」イベントをバインド
    this.report = report;
    this.report.bind("change", this.render);

    var sql = "SELECT * FROM REPORT WHERE year=? AND month=? AND day=?";
    var params = [date.year, date.month, date.day];

    // SQL結果はこの「report」に格納されて「change」イベントが発火する
    this.report.query(sql,params);
},

// 「change」イベントのコールバック
render : function() {
    
    // 取得した「report」をJSON文字列化する
    var json = this.report.toJSON();
    
    // DOMに反映
    this.$el
         .find('.append')
         .append(
            this.template("#report-detail-template",  json)
         );
}
```
#### `sql`

問い合わせSQL。`?`は`params`で指定するパラメータに置換されます。

#### `params`

置換パラメータ。配列で渡す。

---------------------------------------------------------

### save(callback, options)

* RDBへの保存をします
* Salesforceへの同期を行います(オプション)
 * 後述の`sync(success, failure)`と同じ処理です

``` javascript
// モデルを永続化します
report.save(function() {
	alert("レポートを保存しました。");
}, {sync : true}}); // syncオプションでSFへの同期を指定
```

#### `callback`
RDBに保存成功した時のコールバック。省略するとコールバック処理は行われません。

#### `options`
この関数のオプション動作をオブジェクトで指定します。

* `sync`

	trueにするとSFに同期します。(`save`後`sync`が呼び出されます)

* `upsert`

	trueにするとアップサート処理となります。未指定、falseはインサート処理です。

---------------------------------------------------------

### sync(success, failure)

Salesforceへの同期を行います

```javascript
// モデルの生成
var report = new model.Report({
    "id" : UUID.generate(),
    "year" : that.date.year,
    "month" : that.date.month,
    "day" : that.date.day,
    "subject" : $('#subject').val(),
    "content" : $('#content').val()
});

// Salesforceに同期
report.sync();
```

#### `success`
同期に成功したときのコールバック。省略可能。

#### `failure`
同期に失敗したときのコールバック。省略可能。

#### フィールド名の変換について

SFにリクエストするときにフィールド名が変換されてSFにリクエストされます。

* `Model#id`は`lid__c`(Local ID)に変換されます
* `Model#sfRecordName`に指定されている属性が`Name`に変換されます
* その他は`***__c`の形式に変換されます

## 各モデル定義

### tableName

RDBテーブル名。

* 指定されていないモデルは`save`できません。

---------------------------------------------------------

### sfObjectName

Salesforceオブジェクト名。

* 指定されていないモデルは`sync`できません。

---------------------------------------------------------

### sfRecordName

Salesforceのレコード名。API上`Name`で扱われる属性。

* `Name`の値として設定したいモデル属性名を文字列で指定します。
* 指定されていないモデルは`sync`できません。

---------------------------------------------------------

### ddl

RDBのDDL。

---------------------------------------------------------
