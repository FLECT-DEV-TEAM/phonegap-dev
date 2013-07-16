define(['backbone', 'view/index-view','view/detail-view', 'view/menu-view', 'view/new-report-view'],
    function(Backbone, IndexView, DetailView, MenuView, NewReportView) {

    /** 
    * Backbone.Routerを拡張した共通ルータです。
    * 
    * @class CommonRouter
    */
    var common = Backbone.Router.extend({

        _cache : {
            view : {}
        },

        /** 
         * Backboneのビューを初期化します。
         *         
         * @param {Object} viewObject ビューオブジェクト
         * @param {String} viewName ビュー名。キャッシュのキーになるため、アプリケーション内で一意になるようにします。
         * @param {Object} params ビューのinitializeに渡すパラメータ (option)
         * @throws {Error} ビューオブジェクトが指定されていない場合
         * @throws {Error} ビュー名が指定されていない場合
         */
        view: function(viewObject, viewName, params) {
            if (!viewObject) {
                throw new Error("ビューオブジェクトが指定されていません");
            }
            if (!viewName) {
                throw new Error("ビュー名が指定されていません");
            }
            var cached = this._cache.view[viewName];
            if (cached) {
                cached.initialize(params);
            } else {
                this._cache.view[viewName] = new viewObject(params);
            }
        }
    });

    var Router = common.extend({
        routes: {
            "index": "index",
            "detail": "detail",
            "menu": "menu",
            "report/new": "newReport"

        },

        index: function() {
            this.view(IndexView, "Index");
        },
        detail: function() {
             this.view(DetailView, "Detail");
        },
        menu: function() {
            this.view(MenuView, "Menu");
        },
        newReport: function() {
            this.view(NewReportView, "NewReport");
        }

    });

    return new Router();

});
