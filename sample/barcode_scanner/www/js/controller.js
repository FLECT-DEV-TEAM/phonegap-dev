(function() {

    var root = this;

    // Application Common Router.
    var common = Backbone.Router.extend({

        _cache : {
            view : {},
            transition : {}
        },

        view: function(name, params) {
            var cache = this._cache.view[name];
            if (cache) {
                cache.initialize(params);
            } else {
                this._cache.view[name] = new view[name](params);
            }
        }
    });

    var controller = {

        Router: common.extend({

            routes: {
                "scan": "scan",
                "product/:id": "product"
            },

            scan: function() {
                this.view("ScanView");
            },

            product: function(id) {
                this.view("ProductView", id);
            }

        })
    };

    root.controller = controller;

}).call(window);
