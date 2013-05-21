define(['router', 'backbone', 'transition'], function(router, Backbone, Transition) {

    var app = {

        setup: {

            onDeviceReady: function() {
                app.setup.startApp();
            },

            startApp: function() {

                // initialize Backbone Router.
                app.router = new router.Router();
                app.router._cache.transition = new Transition();
                Backbone.history.start();

                // START APPLICATION!!
                app.router.navigate("hello", {trigger: true});
            }
        }
    };

    return app;

});