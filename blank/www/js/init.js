define(['router', 'backbone', 'model/CommonModel', 'model/HelloModel', 'db'],

function(router, Backbone, CommonModel, HelloModel, db) {

    var init = {

        onDeviceReady: function() {
            init._createTable();
        },

        _createTable: function() {
            db.getConn().transaction(
                // create table.
                function(tx) {
                    tx.executeSql(HelloModel.ddl);
                },
                // if create on error.
                function(err) {
                    alert(err.code);
                    alert(err.message);
                },
                // if create on success.
                function() {
                    init._startApp();
                });
        },

        _startApp: function() {
            Backbone.history.start();
            router.navigate("hello", {trigger: true});
        }
    };

    return init;

});