(function() {

    var root = this;

    var common = Backbone.Collection.extend({

        fetch: function(soql, options) {
            var that = this;
            var i, len;
            model.forcetk().query(
                soql,
                function(response){
                    var records = response.records;
                    len = records.length;
                    var models = [];
                    for(i = 0; i < len; i++) {
                        var tempModel = {};
                        for (var attr in records[i]) {
                            if (attr === "attributes") {
                                continue;
                            } else if (attr === "Id") {
                                tempModel["sfid"] = records[i][attr];
                            } else {
                                var renamed = attr.replace("__c", "");
                                tempModel[renamed] = records[i][attr];
                            }
                        }
                        models.push(new that.model(tempModel));
                    }
                    that.add(models);
                    that.trigger("add:all");
                    if (options && options.save) {
                        len = that.size();
                        for (i = 0; i < len; i++) {
                            that.at(i).save(null, options.save);
                        }
                    }
                },
                function(request) {
                    // FIXME
                    alert("fail fetch!");
                }
            );
        },

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

        /************* Define Application collections. */
        Orders : common.extend({
            model: model.Order
        })

    };

    root.collection = collection;

}).call(window);