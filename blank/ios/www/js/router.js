define(['transition', 'backbone', 'view'], function(Transition, Backbone, view) {

    // Application Common Router.
    var common = Backbone.Router.extend({

        _cache : {
            view : {},
            transition : {}
        },

        initialize: function() {
            this._cache.transition = new Transition();
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

    var router = {

        Router: common.extend({

            routes: {
                "hello": "hello"
            },

            hello: function() {
                this.view("HelloView");
            }

        })
    };

    return router;

});
