define(['router', 'backbone'], function(router, Backbone) {

    var app = {

        setup: {

            onDeviceReady: function() {
                app.setup.startApp();
            },

            startApp: function() {
                Backbone.history.start();
                router.navigate("hello", {trigger: true});
            }
        }
    };

    return app;

});