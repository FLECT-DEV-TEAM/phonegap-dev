define(['db'], function(db) {
    return describe("db.js", function() {
      it("データベースの取得", function() {
        var database = db.getConn();
        expect(database).not.toBeUndefined();
      });
    });
});