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

        TopView: common.extend({

            el: "#top-page",

            events: {
                "touchend a" : "test"
            },

            test: function() {
                app.router.navigate("scan", {trigger: true});
            },

            initialize: function() {
                this.render();
            },

            render: function() {
                this.show(this.$el, {effect: false});
            }
        }),

        HistoryView: common.extend({

            el: "#history-page",

            initialize: function(orders) {
                _.bindAll(this, "render");
                this.orders = orders;
                this.orders.bind("add:all", this.render);
                this.orders.query(
                    "SELECT * FROM item_order " +
                    "INNER JOIN item ON item_order.item_id=item.id " +
                    "ORDER BY item_order.order_date DESC", []);
            },

            render: function() {
                this.$el
                    .find('.append')
                    .append(this.template('#history-page-template',
                        this.orders.toJSON()));
                this.show(this.$el);
                console.log(this.orders.toJSON());
            }

        }),

        ItemView: common.extend({
            el: "#item-page",

            events: {
                "touchend .btn" : "renderOrder"
            },

            initialize: function(params) {
                _.bindAll(this, "requestSuccess", "requestOrder");
                this.item = params.item;
                this.item.bind("request:success", this.requestSuccess);
                this.item.bind("request:failure", this.requestFailure);
                this.order = params.order;
                this.order.bind("change", this.requestOrder);
                this.item.request();
            },

            requestSuccess: function() {
                this.item.save();
                this.render();
            },

            render: function() {
                this.$el
                    .find('.append')
                    .append(this.template('#item-page-template',
                        this.item.toJSON()));

                this.show(this.$el);
            },

            requestFailure: function() {
                alert("データが取得できませんでした");
                app.router.navigate("scan", {trigger: true});
            },

            requestOrder: function() {
                this.order.save(function() {
                    alert("発注したよ");
                    app.router.navigate("scan", {trigger: true});
                });
            },

            renderOrder: function() {
                var self = this;
                var slots = [
                    {data: []}
                ];

                for (var j = 1; j < 100; j++) {
                    slots[0].data.push({
                        text: "数量 " + j + "   :   ￥ " + this.item.get("price") * j,
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
                        if(buttonIndex === 1) {
                            self.order.set("amount", selectedValues["0"]);
                        }
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
                var beep = new Audio("beep.wav");
                window.plugins.barcodeScanner.scan(
                    function(result) {
                        if (result.cancelled === true) {
                            app.router.navigate("top", {trigger: true});
                        } else {
                            beep.play();
                            self.render();
                            app.router.navigate("item/" + result.text,
                                {trigger: true}
                            );
                        }
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