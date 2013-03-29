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
                "item/:code": "item"
            },

            scan: function() {
                this.view("ScanView");
            },

            item: function(code) {
                this.view(
                    "ItemView",{
                        item: new model.Item({code: code}),
                        order: new model.Order({id: UUID.generate(), code: code})
                    }
                );
            }
        })
    };

    root.controller = controller;

}).call(window);
