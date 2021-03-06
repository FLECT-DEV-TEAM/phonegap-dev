define(['model', 'db', 'sinon', 'forcetk-extend'], function(CommonModel, db, sinon, forcetk) {

  return describe("model.jsのテスト", function() {

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

    // TEST FOR CommonModel#initialize()
    describe("引数なしで初期化", function() {
      it("idが自動発番される", function() {
        var model = new CommonModel();
        var generatedId = model.id;
        expect(generatedId).not.toBeUndefined();
      });

      it("自動発番されたidはユニークである", function() {
        var model1 = new CommonModel();
        var generatedId1 = model1.id;
        var model2 = new CommonModel();
        var generatedId2 = model2.id;
        expect(generatedId1).not.toBeUndefined();
        expect(generatedId2).not.toBeUndefined();
        expect(generatedId1).not.toEqual(generatedId2);
      });

      it("自動発番されたidはUUID形式である", function() {
        var model = new CommonModel();
        var generatedId = model.id;
        expect(generatedId.length).toEqual(36);
        expect(generatedId).toMatch(/[a-z0-9¥-]/);
      });

      it("noIdをtrueにするとIDは自動発番されない", function() {
        var model = new CommonModel(null, {noId: true});
        expect(model.id).toBeUndefined();
      });

    });

    // TEST FOR CommonModel#initialize(obj)
    describe("引数ありで初期化", function() {
      it("引数のオブジェクトがモデルの属性になる", function() {
        var model = new CommonModel({name: 'test01'});
        var name = model.get('name');
        expect(name).toEqual('test01');
      });

      it("引数のオブジェクトのプロパティにidがなければidが自動発番される", function() {
        var model = new CommonModel({name: 'test01'});
        var generatedId = model.id;
        expect(generatedId).not.toBeUndefined();
      });

      it("noIdをtrueにするとIDは自動発番されない", function() {
        var model = new CommonModel({name: 'test01'}, {noId: true});
        var generatedId = model.id;
        expect(generatedId).toBeUndefined();
      });

      it("引数のオブジェクトのプロパティにidがあればidは自動発番されない", function() {
        var specifiedId = 'id42';
        var model = new CommonModel({id: specifiedId, name: 'test01'});
        var modelId = model.id;
        expect(modelId).toEqual(specifiedId);
      });
    });

    // TEST FOR CommonModel#save()
    describe("データベースへの保存 異常系", function() {

      it("モデルにtableNameが指定されていない場合はエラーが送出される", function() {
        var model = new CommonModel();
        model.tableName = undefined;
        try {
          model.save();
        } catch (e) {
          expect(e).not.toBeUndefined();
        }
      });

    });

    // TEST FOR CommonModel#save()
    describe("データベースへの保存 正常系", function() {

      it("保存に成功する", function() {
        var model = new CommonModel({name: "name01"});
        model.tableName = "HELLO";
        model.save();
        expect(true).toBeTruthy();
      });

      it("保存に成功したときにコールバックを実行する", function() {

        var model = new CommonModel({name: "name02"});
        model.tableName = "HELLO";
        var callback = sinon.spy();
        model.save(callback);
        expect(callback.calledOnce).toBeTruthy();
      });

      it("UPSERT保存に成功する", function() {

        var model = new CommonModel({name: "name03"});
        model.tableName = "HELLO";

        // UPSERTオプション
        var option = {upsert: true};

        var callback = sinon.spy();
        model.save(callback, option);
        expect(callback.calledOnce).toBeTruthy();
      });
    });

    // TEST FOR CommonModel#sync()
    describe("Salesforceへの同期 異常系", function() {
      it("Salesforceのオブジェクト名が設定されていない場合はエラーが送出される", function() {
        var model = new CommonModel();
        model.sfObjectName = undefined;
        model.sfRecordName = "name";
        try {
          model.sync();
        } catch (e) {
          expect(e).not.toBeUndefined();
        }
      });

      it("Salesforceのレコード名(API上のName)に対応する属性が設定されていない場合はエラーが送出される", function() {
        var model = new CommonModel();
        model.sfObjectName = "Hello_c";
        model.sfRecordName = undefined;
        try {
          model.sync();
        } catch (e) {
          expect(e).not.toBeUndefined();
        }
      });

      it("Salesforceのレコード名(API上のName)に設定する値が取得できない場合はエラーが送出される", function() {
        var model = new CommonModel();
        model.sfObjectName = undefined;
        model.sfRecordName = "name";
        try {
          model.sync();
        } catch (e) {
          expect(e).not.toBeUndefined();
        }
      });
    });

    // TEST FOR CommonModel#sync()
    describe("Salesforceへの同期 正常系", function() {
      it("ネットワークがオフラインの場合はfailureコールバックが呼び出され、同期ステータスが2になる", function() {

        // オフライン
        navigator.network.connection.type = "offline";

        var model = new CommonModel({name: "name04"});
        var generatedId = model.id;
        model.tableName = "HELLO";
        model.sfObjectName = "Hello__c";
        model.sfRecordName = "name";

        var success = sinon.spy();
        var failure = sinon.spy();

        model.sync(success, failure);

        expect(success.calledOnce).toBeFalsy();
        expect(failure.calledOnce).toBeTruthy();

        model.clear({silent:true});

        model.bind("change", function() {
          expect(model.id).toEqual(generatedId);
          expect(model.get("name")).toEqual("name04");
          expect(model.get("sync_status")).toEqual("2");
        });
        model.query("SELECT * FROM HELLO WHERE id = ?", [generatedId]);

      });

      it("ネットワークがオンラインで同期に成功した場合はsuccessコールバックが呼び出され、同期ステータスが1になる", function() {

        // オンライン
        navigator.network.connection.type = "online";

        var model = new CommonModel({name: "name05"});
        var generatedId = model.id;
        model.tableName = "HELLO";
        model.sfObjectName = "Hello__c";
        model.sfRecordName = "name";

        var success = sinon.spy();
        var failure = sinon.spy();
        model.sync(success, failure);

        console.log(server.requests);
        server.respondWith(
          "POST",
          "/dummyInstanceURL/services/data/v24.0/sobjects/Hello__c/",
          [200, { "Content-Type": "application/json" }, '{}']);
        server.respond();

        expect(success.calledOnce).toBeTruthy();
        expect(failure.calledOnce).toBeFalsy();

        model.clear({silent:true});

        model.bind("change", function() {
          expect(model.id).toEqual(generatedId);
          expect(model.get("name")).toEqual("name05");
          expect(model.get("sync_status")).toEqual("1");
        });
        model.query("SELECT * FROM HELLO WHERE id = ?", [generatedId]);

      });

      it("ネットワークがオンラインで同期に失敗した場合はfailureコールバックが呼び出され、同期ステータスが2になる", function() {

        // オンライン
        navigator.network.connection.type = "online";

        var model = new CommonModel({name: "name06"});
        var generatedId = model.id;
        model.tableName = "HELLO";
        model.sfObjectName = "Hello__c";
        model.sfRecordName = "name";

        var success = sinon.spy();
        var failure = sinon.spy();
        model.sync(success, failure);

        console.log(server.requests);
        server.respondWith(
          "POST",
          "/dummyInstanceURL/services/data/v24.0/sobjects/Hello__c/",
          [403, { "Content-Type": "application/json" }, '{"error": "forbidden"}']);
        server.respond();

        expect(success.calledOnce).toBeFalsy();
        expect(failure.calledOnce).toBeTruthy();

        model.clear({silent:true});

        model.bind("change", function() {
          expect(model.id).toEqual(generatedId);
          expect(model.get("name")).toEqual("name06");
          expect(model.get("sync_status")).toEqual("2");
        });
        model.query("SELECT * FROM HELLO WHERE id = ?", [generatedId]);
      });
    });

    // TEST FOR CommonModel#query()
    describe("データベースへの検索 異常系", function() {
      it("パラメータが配列ではない", function() {
        var model = new CommonModel();
        try {
          model.query("SELECT * FROM HELLO", "invalid param");
        } catch(e) {
          expect(e).not.toBeUndefined();
        }
      });
    });

    // TEST FOR CommonModel#query()
    describe("データベースへの検索 正常系", function() {
      var model;
      var generatedId;
      beforeEach(function() {
        model = new CommonModel({name : "name07"});
        generatedId = model.id;
        model.tableName = "HELLO";
        model.save();
      });

      it("全件検索でレコードが取得できた場合はchangeイベントが発生してmodelに最初の1件の値がバインドされる", function() {
        var calledCallback = false;

        model.clear({silent : true});
        expect(model.id).toBeUndefined();
        expect(model.get("name")).toBeUndefined();

        model.bind("change", function(){
          calledCallback = true;
        });

        model.query("SELECT * FROM HELLO");

        waitsFor(function() {
          return calledCallback;
        }, "", 5000);

        runs(function() {
          expect(calledCallback).toBeTruthy();
          expect(model.id).toEqual(generatedId);
          expect(model.get("name")).toEqual("name07");
        });
      });

      it("1件に絞り込んだ検索でレコードが取得できた場合はchangeイベントが発生してmodelに値がバインドされる", function() {
        var calledCallback = false;

        model.clear({silent : true});
        expect(model.id).toBeUndefined();
        expect(model.get("name")).toBeUndefined();

        model.bind("change", function(){
          calledCallback = true;
        });

        model.query("SELECT * FROM HELLO WHERE id = ?", [generatedId]);

        waitsFor(function() {
          return calledCallback;
        }, "", 5000);

        runs(function() {
          expect(calledCallback).toBeTruthy();
          expect(model.id).toEqual(generatedId);
          expect(model.get("name")).toEqual("name07");
        });
      });

      it("レコードが取得できなかった場合はnotfoundイベントが発生する", function() {
        var calledCallback = false;

        model.clear({silent : true});
        expect(model.id).toBeUndefined();
        expect(model.get("name")).toBeUndefined();

        model.bind("notfound", function(){
          calledCallback = true;
        });

        model.query("SELECT * FROM HELLO WHERE id = ?", ["NOEXIST"]);

        waitsFor(function() {
          return calledCallback;
        }, "", 5000);

        runs(function() {
          expect(calledCallback).toBeTruthy();
          expect(model.id).toBeUndefined();
          expect(model.get("name")).toBeUndefined();
        });
      });

    });
  });
});