var app = {

    setup: {

        initialize: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        onDeviceReady: function() {
            app.setup.startApp();
        },

        startApp: function() {
            // initialize Backbone Controller.
            app.router = new controller.Router();
            app.router._cache.transition = new Transition();
            Backbone.history.start();

            // START APPLICATION!!
            app.router.navigate("hello", {trigger: true});
        }
    }
};
