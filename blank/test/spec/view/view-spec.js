define(['view'], function(CommonView) {

  return describe("view.jsのテスト", function() {

    describe("CommonView#templateのテスト", function() {

      var handlebarsStub;

      beforeEach(function() {
        handlebarsStub = sinon.stub(Handlebars, "compile");
        handlebarsStub.returns(function() {
          return "template";
        });
      });

      afterEach(function() {
        handlebarsStub.restore();
      });

      // CommonView#template
      it("selectorが指定されていない場合は例外を送出する", function() {
        var view = new CommonView();
        try {
          view.template();
          // 例外により評価されないこと
          expect(false).toBeTruthy();
        } catch (e) {
          expect(e).not.toBeUndefined();
        }
      });

      it("キャッシュにテンプレートがない場合はテンプレートを生成してキャッシュに格納する", function() {
        var view = new CommonView();

        var cache = view._cache.template["<div>test</div>"];
        expect(cache).toBeUndefined();

        view.template("<div>test</div>");

        var cached = view._cache.template["<div>test</div>"];
        expect(cached).not.toBeUndefined();

        var template = cached();
        expect(template).toEqual("template");
      });

      it("キャッシュにテンプレートがある場合はキャッシュにあるテンプレートを返却する", function() {
        var view = new CommonView();

        view._cache.template["<div>test</div>"] = undefined;

        view.template("<div>test</div>");

        var cached1 = view._cache.template["<div>test</div>"];
        expect(cached1).not.toBeUndefined();

        view.template("<div>test</div>");

        var cached2 = view._cache.template["<div>test</div>"];
        expect(cached2).not.toBeUndefined();

        var sameFunction = cached1 === cached2;
        expect(sameFunction).toBeTruthy();

      });
    });
  });
});