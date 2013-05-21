define(['backbone', 'view'], function(Backbone, view) {

    // Application Common Router.
    var common = Backbone.Router.extend({

        _cache : {
            view : {}
        },

        view: function(name, params) {
            var cached = this._cache.view[name];
            if (cached) {
                cached.initialize(params);
            } else {
                this._cache.view[name] = new view[name](params);
            }
        }
    });

    router = {

        Router: common.extend({

            routes: {
                "hello": "hello"
            },

            hello: function() {
                this.view("HelloView");
            }

        })
    };
    return new router.Router();

});
