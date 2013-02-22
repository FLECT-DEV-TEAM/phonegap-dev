(function() {

    var root = this;

    var common = Backbone.Collection.extend({

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
                            that.trigger("addAll");
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
        Calendars : Backbone.Collection.extend({
            model: model.Calendar
        }),
        Reports : Backbone.Collection.extend({
            model: model.Report
        }),
        Clients : common.extend({
            model : model.Client,
            tableName : "CLIENT"
        }),
        Destinations : common.extend({
            model: model.Destination,
            tableName : "DESTINATION"
        })
    };

    root.collection = collection;

}).call(window);