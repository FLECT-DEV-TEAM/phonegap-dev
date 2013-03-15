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

        ScanView: common.extend({

            el: "#top-page",

            events: {
                "click button": "next"
            },

            initialize: function() {
                alert("init.");
                this.scan();
            },

            scan: function() {
                var self = this;

                window.plugins.barcodeScanner.scan(
                    function(result) {
                        self.render(result.text);
                    },
                    function(message) {
                        alert(message);
                    }
                );
            },

            render: function(code) {

                var self = this;

                $.ajax({
                    url: "http://immense-shelf-1535.herokuapp.com/search/" + code,
                    type: "GET",
                    dataType: "json"
                })
                .done(function(data) {
                    console.log(data);
                    self.$el
                        .find('.append')
                        .append(self.template('#top-page-template', data));

                    self.show(self.$el);
                })
                .fail(function(data) {
                    alert("データが取得できませんでした");
                    console.log(data);
                });

            },

            next: function() {
                app.router.navigate("scan", {trigger: true});
            }
        })
    };

    root.view = view;

}).call(window);