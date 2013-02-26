(function() {

    var root = this;

    var common = Backbone.Collection.extend({

        query: function(sql, params) {
            var that = this;
            model.database().transaction(
                function(tx) {
                    tx.executeSql(
                        sql,
                        params,
                        function(tx, results){
                            var len = results.rows.length;
                            var models = [];
                            for (var i = 0; i < len; i++) {
                                models.push(new that.model(results.rows.item(i)));
                            }
                            that.add(models);
                            that.trigger("add:all");
                        },
                        function(err) {
                            alert('ERROR:' + err.code);
                            alert('ERROR:' + err.message);
                        }
                    );
                },
                function(err) {
                    alert('ERROR:' + err.code);
                    alert('ERROR:' + err.message);
                }
            );
        },

        findAll : function() {
            var that = this;
            root.model.database().transaction(
                function(tx) {
                    tx.executeSql(
                        'SELECT * FROM ' + that.tableName,
                        [],
                        function(tx, results){
                            var len = results.rows.length;
                            var models = [];
                            for (var i = 0; i < len; i++) {
                                models.push(new that.model(results.rows.item(i)));
                            }
                            that.add(models);
                            that.trigger("add:all");
                        },
                        function(err) {
                            window.alert('ERROR:' + err.code);
                            window.alert('ERROR:' + err.message);
                        }
                    );
                },
                function(err) {
                    window.alert('ERROR:' + err.code);
                    window.alert('ERROR:' + err.message);
                }
            );
        }

    });

    var collection = {
        Calendars : common.extend({
            model: model.Calendar
        }),
        Reports : common.extend({
            model: model.Report,
            tableName : "REPORT"
        }),
        Clients : common.extend({
            model : model.Client,
            tableName : "CLIENT"
        }),
        Destinations : common.extend({
            model: model.Destination,
            tableName : "DESTINATION"
        }),
        Pictures : common.extend({
            model : model.Picture,
            tableName : "PICTURE"
        })
    };

    root.collection = collection;

}).call(window);