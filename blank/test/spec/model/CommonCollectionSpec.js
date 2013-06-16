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
      it("データ取得に成功して1件以上の結果が返却されるとadd:allイベントが発生して内包するモデルにデータがバインドされる", function() {
        var calledCallback = false;

        var collection = new CommonCollection();
        collection.sfRecordName = "name";
        collection.bind("add:all", function() {
          calledCallback = true;
        });
        collection.fetch("SELECT Id, Name FROM Hello_c");
        console.log(server.requests);

        server.respondWith(
          "GET",
          /.*/,
          [200, { "Content-Type": "application/json" },
          '{' +
            '"records":' +
            '[' +
              '{"Id": "001","Name": "name001", "lid__c" : "LOCAL001",' +
                '"attributes": { "type": "Hello", "url": "/services/data/v24.0/sobjects/Hello__c/001"}'+
              '},'+
              '{"Id": "002","Name": "name002","lid__c" : "LOCAL002",' +
              '"attributes": {"type": "Hello","url": "/services/data/v24.0/sobjects/Hello__c/002"}'+
              '}]' +
            '}'
        ]);
        server.respond();

        waitsFor(function() {
          return calledCallback;
        }, "", 5000);

        runs(function() {
          expect(calledCallback).toBeTruthy();
          expect(collection.length).toEqual(2);

          var model1 = collection.at(0);
          expect(model1.id).toEqual("LOCAL001");
          expect(model1.get("name")).toEqual("name001");
          expect(model1.get("sfid")).toEqual("001");

          var model2 = collection.at(1);
          expect(model2.id).toEqual("LOCAL002");
          expect(model2.get("name")).toEqual("name002");
          expect(model2.get("sfid")).toEqual("002");
        });
      });

      it("データ取得に成功して結果が0件の場合はnotfoundイベントが発生する", function() {
        var calledCallback = false;

        var collection = new CommonCollection();
        collection.bind("notfound", function() {
          calledCallback = true;
        });
        collection.fetch("SELECT Id, Name FROM Hello_c WHERE Name = 'NOEXIST'");
        console.log(server.requests);

        server.respondWith(
          "GET",
          /.*/,
          [200, { "Content-Type": "application/json" },
          '{"records":[]}'
        ]);
        server.respond();

        waitsFor(function() {
          return calledCallback;
        }, "", 5000);

        runs(function() {
          expect(calledCallback).toBeTruthy();
          expect(collection.length).toEqual(0);
        });

      });

      it("データ取得に失敗した場合はfailureイベントが発生する", function() {
        var calledCallback = false;

        var collection = new CommonCollection();
        collection.bind("failure", function() {
          calledCallback = true;
        });
        collection.fetch("SELECT Id, Name FROM Noexist__c");
        console.log(server.requests);

        server.respondWith(
          "GET",
          /.*/,
          [403, { "Content-Type": "application/json" },
          '{"error": "invalid soql"}'
        ]);
        server.respond();

        waitsFor(function() {
          return calledCallback;
        }, "", 5000);

        runs(function() {
          expect(calledCallback).toBeTruthy();
          expect(collection.length).toEqual(0);
        });
      });
    });
  });
});