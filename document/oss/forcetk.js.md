# forcetk.js

Salesforceとの連携を行うライブラリです。

[https://github.com/developerforce/Force.com-JavaScript-REST-Toolkit](https://github.com/developerforce/Force.com-JavaScript-REST-Toolkit)

Salesforceに対して以下の処理を行うことができます。

* 検索 (query)
* 作成 (create)
* 更新 (update/upsert)
* 削除 (delete)

## 前提条件

`forcetk.js`はSalesforceのRestAPIを利用します。そのため事前にOAuthによってアクセストークンを得る必要があります。OAuthは`forcetk.js`を拡張した`forcetk-extend.js`の`authenticate()`に実装されています。

[forcetk-extend.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/forcetk-extend.js.md)

## 方針

`forcetk.js`は __直接使わない方針__ です。MVCのモデル実装である`model.js`または`collection.js`にラップしましょう。
現時点でブランクプロジェクトに実装されているのは以下です。

| 処理 | forcetk.js | model.js | collection.js |
|:-----------|:--------------|:------------------|:----------|
| 検索 | query() | - | fetch() |
| 作成 | create() | save() | - |
| 更新 | update()/upsert() | - | - |
| 削除 | del() | - | - |

実装の詳細は`model.js`と`collection.js`を参照してください。

* [model.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/model.js.md)
* [collection.js](https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/collection.js.md)

