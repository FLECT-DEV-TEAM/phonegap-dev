define(['router', 'view/HelloView'], function(router, HelloView) {

    return describe("router.jsのテスト", function() {

        describe("CommonRouterのviewのテスト", function() {
            // CommonRouter#view
            it("キャッシュにViewインスタンスがない場合はViewを新たに初期化してキャッシュに格納する", function() {
            });
            it("キャッシュにViewインスタンスがある場合はViewを再利用する", function() {
            });
        });
    });
});