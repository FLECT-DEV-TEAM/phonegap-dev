// Application Common View.
define(['backbone', 'jquery', 'handlebars', 'transition'], function(Backbone, $, Handlebars, transition) {

    return Backbone.View.extend({

        _cache : {
            template : {}
        },

        template: function(selector, params) {
            var _cache = this._cache.template[selector];
            if (_cache) {
                return _cache(params);
            } else {
                var source = $(selector).html();
                var template = Handlebars.compile(source);
                this._cache.template[selector] = template;
                return template(params);
            }
        },

        show : function($obj, options) {
            transition.show($obj, options);
        },

        back : function() {
            return transition.back();
        }

    });

});