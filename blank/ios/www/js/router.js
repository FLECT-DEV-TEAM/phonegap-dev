define(['backbone', 'view/HelloView'], function(Backbone, HelloView) {

    // Application Common Router.
    var common = Backbone.Router.extend({

        _cache : {
            view : {}
        },

        view: function(viewInstance, params) {
            var cached = this._cache.view.viewInstance;
            if (cached) {
                cached.initialize(params);
            } else {
                this._cache.view.viewInstance = new viewInstance(params);
            }
        }
    });

    router = {

        Router: common.extend({

            routes: {
                "hello": "hello"
            },

            hello: function() {
                this.view(HelloView);
            }

        })
    };
    return new router.Router();

});
