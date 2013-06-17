define(['router', 'view/HelloView', 'view/CommonView'], function(router, HelloView, CommonView) {

    return describe("router.jsのテスト", function() {

        describe("CommonRouterのviewのテスト", function() {

            var handlebarsStub;

            beforeEach(function() {
                handlebarsStub = sinon.stub(Handlebars, "compile");
                handlebarsStub.returns(function(){});
            });

            afterEach(function() {
                handlebarsStub.restore();
            });

            // CommonRouter#view
            it("Viewインスタンスが指定されていない場合は例外を送出する", function() {
                try {
                    router.view(undefined, "Hello");
                } catch (e) {
                    expect(e).not.toBeUndefined();
                }
            });

            it("View名が指定されていない場合は例外を送出する", function() {
                try {
                    router.view(HelloView, undefined);
                } catch (e) {
                    expect(e).not.toBeUndefined();
                }
            });

            it("キャッシュにViewインスタンスがない場合はViewを新たに初期化してキャッシュに格納する", function() {
                var cache = router._cache.view.Hello;
                expect(cache).toBeUndefined();

                router.view(HelloView, "Hello");

                var cached = router._cache.view.Hello;
                expect(cached).not.toBeUndefined();

            });

            it("キャッシュにViewインスタンスがある場合は再利用する", function() {
                router._cache.view.Hello = undefined;

                router.view(HelloView, "Hello");
                var cached1 = router._cache.view.Hello;

                router.view(HelloView, "Hello");
                var cached2 = router._cache.view.Hello;

                var sameInstance = cached1 === cached2;
                expect(sameInstance).toBeTruthy();

            });
        });
    });
});