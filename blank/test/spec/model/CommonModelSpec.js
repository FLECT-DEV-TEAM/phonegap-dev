define(['model/CommonModel'], function(CommonModel) {

  return describe("CommonModel", function() {

    it("オブジェクトを引数に指定せずに初期化した場合はUUIDでIDが発番される", function() {
      var commonModel = new CommonModel();
      expect(commonModel).not.toBeUndefined();
    });

  });
});