define(['backbone', 'view/hello-view'], function(Backbone, HelloView) {

  'use strict';

  /**
   * Backbone.Routerを拡張した共通ルータです。
   *
   * @class CommonRouter
   */
  var common = Backbone.Router.extend({

    _cache: {
      view: {}
    },

    /**
     * Backboneのビューを初期化します。
     *
     * @param {Object} ViewObject ビューオブジェクト
     * @param {String} viewName ビュー名。キャッシュのキーになるため、アプリケーション内で一意になるようにします。
     * @param {Object} params ビューのinitializeに渡すパラメータ (option)
     * @throws {Error} ビューオブジェクトが指定されていない場合
     * @throws {Error} ビュー名が指定されていない場合
     */
    view: function(ViewObject, viewName, params) {
      if (!ViewObject) {
        throw new Error('ビューオブジェクトが指定されていません');
      }
      if (!viewName) {
        throw new Error('ビュー名が指定されていません');
      }
      var cached = this._cache.view[viewName];
      if (cached) {
        cached.initialize(params);
      } else {
        this._cache.view[viewName] = new ViewObject(params);
      }
    }
  });

  var Router = common.extend({
    routes: {
      'hello': 'hello'
    },

    hello: function() {
      this.view(HelloView, 'Hello');
    }
  });

  return new Router();

});
