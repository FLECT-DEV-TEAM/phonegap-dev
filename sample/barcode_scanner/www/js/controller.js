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
                "top": "top",
                "scan": "scan",
                "item/:code": "item",
                "history": "history"
            },

            top: function() {
                this.view("TopView");
            },

            scan: function() {
                this.view("ScanView");
            },

            item: function(code) {
                var itemId = UUID.generate();
                this.view(
                    "ItemView",{
                        item: new model.Item({id: itemId, code: code}),
                        order: new model.Order({id: UUID.generate(), item_id: itemId})
                    }
                );
            },

            history: function() {
                this.view("HistoryView", new collection.Orders());
            }
        })
    };

    root.controller = controller;

}).call(window);
