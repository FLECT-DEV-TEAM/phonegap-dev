define(['model/CommonCollection', 'db', 'sinon', 'forcetk-extend'], function(CommonCollection, db, sinon, forcetk) {

  return describe("CommonCollection.jsのテスト", function() {

    var server;

    beforeEach(function() {
      var initialized = false;
      db.getConn().transaction(
        function(tx) {
          tx.executeSql("DROP TABLE IF EXISTS HELLO");
          tx.executeSql("CREATE TABLE HELLO(id primary key, name, sync_status)");
        },
        function(err) {
          throw new Error("データベースの初期化に失敗しました。");
        },
        function() {
            initialized = true;
        }
      );
      waitsFor(function() {
        return initialized;
      }, "データベースの初期化", 5000);
      runs(function() {
        // ネットワーク関連の設定
        navigator.network = {};
        navigator.network.connection = {};
        Connection = {};
        Connection.UNKNOWN = "offline";
        // Salesforceのダミーサーバー
        server = sinon.fakeServer.create();
        // forcetkの初期化
        forcetk.setSessionToken("dummySessionId", null, "/dummyInstanceURL");
      });
    });

    // TEST FOR CommonCollection#fetch
    describe("Salesforceからのデータ取得", function() {
      it("データ取得に成功して1件以上の結果が返却されるとadd:allイベントが発生する", function() {
        console.log(server.requests);
        server.respondWith(
          "GET",
          "/dummyInstanceURL/services/data/v24.0/sobjects/Hello__c/",
          [200, { "Content-Type": "application/json" },
          '"records":' +
            '[' +
              '{"Id": "001","Name": "name001", ' +
                '"attributes": { "type": "Hello", "url": "/services/data/v24.0/sobjects/Hello__c/001"}'+
              '},'+
              '{"Id": "002","Name": "name002",' +
              '"attributes": {"type": "Hello","url": "/services/data/v24.0/sobjects/Hello__c/002"}'+
              '}]'
          ]);
        server.respond();
      });

      it("データ取得に成功して結果が0件の場合はnotfoundイベントが発生する", function() {
      });

      it("データ取得に失敗した場合はfailureイベントが発生する", function() {
      });
    });
  });
});