(function() {

    var root = this;

    // Application Common View.
    var common = Backbone.View.extend({
    
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
            app.router._cache.transition.show($obj, options);
        },

        back : function() {
            return app.router._cache.transition.back();
        }

    });

    var view = {

        HelloView: common.extend({

            el: "#top-page",

            initialize: function() {
                this.render();
            },

            render: function(params) {
                this.$el
                    .find('.append')
                    .append(this.template('#top-page-template'));
                this.show(this.$el);
                window.plugins.barcodeScanner.scan(
                    function(result) {alert(JSON.stringify(result));},
                    function(message) {alert(message);});
            }
        })
    };

    root.view = view;

}).call(window);