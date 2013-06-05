define(['model/CommonModel'], function(CommonModel) {

  return describe("CommonModel", function() {

    it("初期化:引数なし:idが自動発番される", function() {
      var commonModel = new CommonModel();
      var generatedId = commonModel.id;
      expect(generatedId).not.toBeUndefined();
    });

    it("初期化:引数なし:自動発番されたidはユニークである", function() {
      var model1 = new CommonModel();
      var generatedId1 = model1.id;
      var model2 = new CommonModel();
      var generatedId2 = model2.id;
      expect(generatedId1).not.toBeUndefined();
      expect(generatedId2).not.toBeUndefined();
      expect(generatedId1).not.toEqual(generatedId2);
    });

    it("初期化:引数にオブジェクトあり:オブジェクトがモデルの属性になる", function() {
      var commonModel = new CommonModel({name: 'test01'});
      var name = commonModel.get('name');
      expect(name).toEqual('test01');
    });

    it("初期化:引数にオブジェクトあり:オブジェクトのプロパティにidなし:idが自動発番される", function() {
      var commonModel = new CommonModel({name: 'test01'});
      var generatedId = commonModel.id;
      expect(generatedId).not.toBeUndefined();
    });

    it("初期化:引数にオブジェクトあり:オブジェクトのプロパティにidあり:指定したidがモデルの属性になる", function() {
      var specifiedId = 'id42';
      var commonModel = new CommonModel({id: specifiedId, name: 'test01'});
      var modelId = commonModel.id;
      expect(modelId).toEqual(specifiedId);
    });

  });
});