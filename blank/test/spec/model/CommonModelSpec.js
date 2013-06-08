define(['model/CommonModel', 'db'], function(CommonModel, db) {

  return describe("CommonModel.jsのテスト", function() {

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

      beforeEach(function() {
        var initialized = false;
        db.getConn().transaction(
          function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS HELLO(id primary key, name)");
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
          // NOP
        });
      });

      it("保存に成功する", function() {
        var model = new CommonModel();
        model.tableName = "HELLO";
        model.save();
        expect(true).toBeTruthy();
      });

      it("保存に成功したときにコールバックを実行する", function() {

        // コールバック用のオブジェクト
        var O = function() {};
        O.prototype.callback = function() {};
        var obj = new O();

        // コールバックが実行されたかSpyに監視させる
        spyOn(obj, 'callback');

        var model = new CommonModel();
        model.tableName = "HELLO";
        model.save(obj.callback);
        expect(obj.callback).toHaveBeenCalled();
      });

      it("UPSERT保存に成功する", function() {

        // コールバック用のオブジェクト
        var O = function() {};
        O.prototype.callback = function() {};
        var obj = new O();

        // コールバックが実行されたかSpyに監視させる
        spyOn(obj, 'callback');

        var model = new CommonModel();
        model.tableName = "HELLO";
        // UPSERTオプション
        var option = {upsert: true};
        model.save(obj.callback, option);
        expect(obj.callback).toHaveBeenCalled();
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
  });
});