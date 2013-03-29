var app = {

    setup: {

        initialize: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        onDeviceReady: function() {
            // initialize database.
            var db = model.database();
            // begin transaction.
            db.transaction(
                // create table.
                function(tx) {
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS ITEM(' +
                            'code text primary key, ' +
                            'title, ' +
                            'price, ' +
                            'formattedPrice, ' +
                            'company, ' +
                            'image)'
                    );
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS ITEM_ORDER(' +
                            'id text primary key, ' +
                            'code, ' +
                            'amount, ' +
                            'order_date DEFAULT CURRENT_DATE)'
                    );
                },
                // if create on error.
                function(err) {
                    alert(err.code);
                    alert(err.message);
                },
                // if create on success.
                function() {
                    app.setup.startApp();
                }
            );
        },

        startApp: function() {
            // initialize Backbone Controller.
            app.router = new controller.Router();
            app.router._cache.transition = new Transition();
            Backbone.history.start();

            // START APPLICATION!!
            app.router.navigate("item/4902370518986", {trigger: true});
        }
    }
};
