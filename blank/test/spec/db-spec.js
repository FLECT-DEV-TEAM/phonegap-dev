define(['db'], function(db) {
  return describe("db.jsのテスト", function() {
    it("データベースの取得", function() {
      var database = db.getConn();
      expect(database).not.toBeUndefined();
    });
  });
});