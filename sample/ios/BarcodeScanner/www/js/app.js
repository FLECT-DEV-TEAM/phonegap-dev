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
                            'id text primary key, ' +
                            'code, ' +
                            'title, ' +
                            'price, ' +
                            'formattedPrice, ' +
                            'company, ' +
                            'image)'
                    );
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS ITEM_ORDER(' +
                            'id text primary key, ' +
                            'item_id, ' +
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

            // initialize tabbar
            var tabBar = cordova.require("cordova/plugin/iOSTabBar");
            tabBar.init();
            tabBar.create();
            tabBar.create({selectedImageTintColorRgba: "255,40,0,255"});

            tabBar.createItem(
                "scan", "商品スキャン", "",{
                    onSelect: function() {
                        app.router.navigate("top", {trigger: true});
                    }
                }
            );
            tabBar.createItem(
                "history", "発注履歴", "",{
                    onSelect: function() {
                        app.router.navigate("history", {trigger: true});
                    }
                }
            );

            tabBar.show();
            tabBar.showItems("scan", "history");

            // initialize Backbone Controller.
            app.router = new controller.Router();
            app.router._cache.transition = new Transition();
            Backbone.history.start();

            // START APPLICATION!!
            tabBar.selectItem("scan");
        }
    }
};
