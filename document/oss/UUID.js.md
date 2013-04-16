# UUID.js

モデルを一意にするためのIDを発行するライブラリです。

https://github.com/LiosK/UUID.js

UUIDの生成はバージョン4(乱数利用)を利用します。IDはRDB各テーブルのプライマリキーとなります。

## なぜUUIDなのか

オフライン対応を前提とするため端末側でIDは発行しなければいけません。
端末のRDBシーケンスを利用した番号だと、Salesforceに同期したときに他の端末とIDを区別するのが面倒になります。
これらを考慮するとUUIDを利用するのがシンプルな解決となります。

## UUIDの生成

モデルを初期化するときに`UUID.generate()`してください。

```javascript
var report = new model.Report({
	"id" : UUID.generate(),
	"year" : date.year,
	"month" : date.month,
	"day" : date.day,
	"subject" : $('#subject').val(),
	"content" : $('#content').val()
});
```