# collection.js

`collection.js`は、モデルの集合を _コレクション_ として表現します。

## コレクションとは？

コレクションは特定のモデルを複数内包したものです。

たとえば、「レポート」というモデルがあったとき、一覧画面に表示するリストは「複数のレポート」の集合になるはずです。これをレポートのコレクションとして表現します。コレクションはモデルと同じくデータ操作を行う機能を持ち、対応づけられたモデルの集合に操作の結果がバインドされます。

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/collection.js

```javascript
// collection.js

// コレクションのプロトタイプです
var common = Backbone.Collection.extend({

    fetch : function(soql, options) {
        ....
    }

    query : function(sql, params) {
        ....
    },

    findAll : function() {
        ....
    }
});

// アプリケーションのコレクションです
var collection = {

    Calendars : common.extend({
        model: model.Calendar
    }),
    Reports : common.extend({
        model: model.Report,
        tableName : "REPORT"
    }),
    Clients : common.extend({
        model : model.Client,
        tableName : "CLIENT"
    }),
    Destinations : common.extend({
        model: model.Destination,
        tableName : "DESTINATION"
    }),
    Pictures : common.extend({
        model : model.Picture,
        tableName : "PICTURE"
    })
};
```

## Usage

### model

このコレクションが内包するモデルを指定します。

***

### tableName

RDBテーブル名を指定します。指定されていない場合は`findAll`が利用できません。

***

###  query(sql, params)

RDB検索をしデータを取得します。取得した結果は対応するモデルにバインドされます。

* データ件数分のモデルが生成されコレクションに追加されます
* `add:all`イベントが発火します
* `add:all`イベントを監視してコレクションの変更をUIに反映するなどします

```javascript

// view.js

initialize: function(reports) {

    // コレクション「reports」
    this.reports = reports;
    
    // renderのコンテキスト「this」を「Backbone.View」に拘束する
    _.bindAll(this, 'render');

    // 「add:all」イベントが発火したらrender()を呼び出す
    this.reports.bind("add:all", this.render);

    // 検索
    this.reports.query(
        "SELECT * FROM REPORT WHERE year=?",
        ['2013']
    );
    
},

render : function() {

    // 「reports」に検索結果が入っているのでJSON化してDOMに反映
    this.$el
    .find('.append')
    .append(this.template("#report-detail-template",
            this.reports.toJSON()));

}
```

#### `sql`

問い合わせSQL。`?`は`params`で指定するパラメータに置換されます。

#### `params`

置換パラメータ。配列で渡す。

***

### findAll()

RDB検索によりコレクションが対応するモデルのデータを全件取得します。取得した結果は対応するモデルにバインドされます
 
* データ件数分のモデルが生成されコレクションに追加されます
* `add:all`イベントが発火します
* `add:all`イベントを監視してコレクションの変更をUIに反映するなどします

処理の流れは`query`と同じになります。

```javascript
initialize: function(clients) {

    // コレクション「clients」
    this.clients = clients;
    
    // renderのコンテキスト「this」を「Backbone.View」に拘束する
    _.bindAll(this, 'render');

    // 「add:all」イベントが発火したらrender()を呼び出す
    this.clients.bind("add:all", this.render);

    // 検索
    this.clients.findAll();
},

render: function() {

    // 「clients」に検索結果が入っているのでJSON化してDOMに反映
    this.$el
        .find('.append')
        .append(this.template("#client-template",
            this.clients.toJSON()));
},
```

***

### fetch(soql, options)

Salesforceに検索リクエストを送信してデータを取得します。取得した結果は対応するモデルにバインドされます

* データ件数分のモデルが生成されコレクションに追加されます
 * `add:all`イベントが発火します
 * `add:all`イベントを監視してコレクションの変更をUIに反映するなどします
* 結果をそのままローカルのSQLiteに保存することも可能

```javascript
// Salesforceからマスタを取得してローカルのSQLiteに保存する例

var clients = new collection.Clients();
clients.fetch(
    "SELECT Id, Name FROM Client__c", {save : {upsert : true}}
);
```

#### `soql`

問い合わせSOQL。

#### `optons`

オプションをオブジェクトで指定します。

* `save`

    コレクションにバインドされたモデルをすべてSQLiteに保存します。値は`Model.save`の`options`に渡されます。

#### モデルへのバインド時の変換ルール

検索によってSalesforceから返却されたJSONはモデルにバインドするときにプロパティ名が変換されます。

| Salesforceから返却されるJSONのプロパティ名 | モデルにバインドされるときのプロパティ名 |
|:----------------------|:----------------------|
| attributes            | (モデルにはバインドされない) |
| Id                    | sfid                  |
| Xxx_c (カスタムフィールド)  | xxx                   |
