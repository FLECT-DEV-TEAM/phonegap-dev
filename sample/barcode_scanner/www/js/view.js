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

        ProductView: common.extend({
            el: "#top-page",

            events: {
                "click a" : "order"
            },

            initialize: function(id) {
                this.request(id);
            },

            request: function(id) {
                var self = this;
                console.log(id);
                $.ajax({
                    url: "http://immense-shelf-1535.herokuapp.com/search/" + id,
                    type: "GET",
                    dataType: "json"
                })
                .done(function(data) {
                    self.item = data;
                    self.render(data);
                })
                .fail(function(data) {
                    alert("データが取得できませんでした");
                    app.router.navigate("scan", {trigger: true});
                    console.log(data);
                });

            },

            render: function(data) {
                this.$el
                    .find('.append')
                    .append(this.template('#top-page-template', data));

                this.show(this.$el);
            },

            order: function() {

                var slots = [
                    {data: []}
                ];

                for (var j = 1; j < 100; j++) {
                    slots[0].data.push({
                        text: "数量 " + j + "   :   ￥ " + this.item.price * j,
                        value: j
                    });
                }

                var options = {
                    style: 'black-opaque',
                    doneButtonLabel: '決定',
                    cancelButtonLabel: '中止'
                };

                window.plugins.pickerView.create(slots, options,
                    function(selectedValues, buttonIndex) {
                        console.log(selectedValues);
                    }
                );
            }

        }),

        ScanView: common.extend({

            el: "#scan-page",

            initialize: function() {
                this.scan();
            },

            scan: function() {
                var self = this;
                window.plugins.barcodeScanner.scan(
                    function(result) {
                        self.render();
                        app.router.navigate("product/" + result.text,
                            {trigger: true}
                        );
                    },
                    function(message) {
                        alert(message);
                    }
                );
            },
            render: function() {
                this.show(this.$el, {effect: false});
            }
        })
    };

    root.view = view;

}).call(window);