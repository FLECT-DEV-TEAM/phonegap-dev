define(['router', 'backbone', 'model/CommonModel'], function(router, Backbone, CommonModel) {

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