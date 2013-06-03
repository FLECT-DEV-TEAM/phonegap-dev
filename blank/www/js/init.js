define(['router', 'backbone', 'model/CommonModel', 'model/HelloModel'],

function(router, Backbone, CommonModel, HelloModel) {

    var init = {

        onDeviceReady: function() {
            init._createTable();
        },

        _createTable: function() {
            var db = CommonModel._database();
            db.transaction(
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