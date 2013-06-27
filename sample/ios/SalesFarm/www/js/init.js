define(['router', 'backbone', 'model/hello-model', 'db', 'pageslider', 'jquery'],

function(router, Backbone, HelloModel, db, PageSlider, $) {

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
            var slider = new PageSlider($("#container"));
            $.fn.extend( {
                slide: function() {
                    slider.slidePage(this);
                }
            });
            Backbone.history.start();
            router.navigate("hello", {trigger: true});
        }
    };

    return init;

});