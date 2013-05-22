// Application Common Model.
define(['backbone', 'forcetk-extend'], function(Backbone, forcetk) {

    var CommonModel = Backbone.Model.extend({

        // instance methods.
        initialize: function(obj) {
            if(obj) {
                this.set(obj);
            }
        },


        save: function(callback, options) {
            if (this.tableName === undefined) {
                alert("tableName is not defined.");
                return;
            }
            var param = [];
            var attributes = this.attributes;
            var tableName = this.tableName;
            var columns = "";
            var preparedStatement = "";

            for (var attribute in attributes) {
                param.push(this.get(attribute));
                columns = columns + attribute + ",";
                preparedStatement = preparedStatement + "?,";
            }

            columns = columns.substr(0, columns.length - 1);
            preparedStatement = preparedStatement.substr(0, preparedStatement.length - 1);

            var insertSql = "INSERT INTO ";
            if (options && options.upsert) {
                insertSql = "INSERT OR REPLACE INTO ";
            }

             CommonModel._database().transaction(
                function(tx) {
                    tx.executeSql(insertSql + tableName + '('+ columns +') ' +
                        'VALUES (' + preparedStatement + ')', param);
                },
                function(err) {
                    alert(err.code);
                    alert(err.message);
                },
                callback || function(){}
            );

            if (options && options.sync) {
                this.sync();
            }
        },

        sync: function(success, failure) {
            if(this.sfObjectName === undefined) {
                alert("sfObjectName is not defined.");
                return;
            }
            var attributes = this.attributes;
            // FIXME!!
            var name = this.get("subject") || this.get("id");
            var obj = {"Name" : name};
            for (var attribute in attributes) {
                // temporary workaround...
                if (attribute !== "sync_status" &&
                        attribute !== "reg_time") {
                    obj[attribute + "__c"] = this.get(attribute);
                }
            }
            // check network.
            var networkState = navigator.network.connection.type;
            var that = this;
            if (Connection.UNKNOWN === networkState) {
                that.set({"sync_status":"2"});
                that.save(
                    function() {
                        console.log("update sync_status 2");
                    }, {upsert : true});
            } else {
                forcetk.create(
                    this.sfObjectName,
                    obj,
                    success || function() {
                        console.log("success sync:" + obj);
                        // update sync_status (it means already sync to salesforce).
                        that.set({"sync_status":"1"});
                        that.save(
                            function() {
                                console.log("update sync_status 1");
                            }, {upsert : true}
                        );
                    },
                    failure || function(jqXHR) {
                        console.log("failure sync:" + obj);
                        // update sync_status (it means has not yet sync to salesforce).
                        that.set({"sync_status":"2"});
                        that.save(
                            function() {
                                console.log("update sync_status 2");
                            }, {upsert : true}
                        );
                        alert(jqXHR.responseText);
                    }
                );
            }
        },

        query: function(sql, params) {
            // FIXME sqlが文字列かparamsが配列かをチェックしたほうがいい！
            var that = this;
            CommonModel._database().transaction(
                function(tx) {
                    tx.executeSql(
                        sql,
                        params,
                        function(tx, results) {
                            if (results.rows.length > 0) {
                                that.set(results.rows.item(0));
                            }
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
        }

    },{

        _database : function() {
            // TODO キャッシュ
            return window.openDatabase(
                "hello",
                "1.0",
                "Hello",
                100000);
        },

        _query: function(sql, params, callback) {
            CommonModel._database().transaction(
                function(tx) {
                    tx.executeSql(
                        sql,
                        params,
                        callback,
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
        }
    });

    return CommonModel;
});
