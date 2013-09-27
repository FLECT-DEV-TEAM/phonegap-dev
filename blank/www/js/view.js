// Application Common View.
define(['backbone', 'jquery', 'handlebars'], function(Backbone, $, Handlebars) {

  /**
   * Backbone.Viewを拡張した共通ビューです。
   *
   * @class CommonView
   */
  return Backbone.View.extend({

    _cache: {
      template: {}
    },

    /**
     * HandlebarsテンプレートからHTMLを返却します。
     *
     * @param {String} selector Handlebarsテンプレートを指すセレクタ
     * @param {Object} params テンプレートに渡すパラメータ
     * @throws {Error} selectorが指定されていない場合
     */
    template: function(selector, params) {
      if (selector === undefined || selector === null) {
        throw new Error("selectorが指定されていません");
      }
      var _cache = this._cache.template[selector];
      if (_cache) {
        return _cache(params);
      } else {
        var source = $(selector).html();
        if (source) {
          source = source.replace(/^\s+/, "");
        }
        var template = Handlebars.compile(source);
        this._cache.template[selector] = template;
        return template(params);
      }
    }
  });

});