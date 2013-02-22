(function() {
    
    var root = this;

    // SalesReport Common Model.
    var common = Backbone.Model.extend({

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

            model.database().transaction(
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
                model.forcetk().create(
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

        findAll: function(callback) {
            var that = this;
            model.database().transaction(
                function(tx) {
                    tx.executeSql(
                        'SELECT * FROM ' + that.tableName,
                        [],
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

    },{
        // class methods.
        query: function(sql, params, callback) {
            model.database().transaction(
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
        },

        fetch: function(callback, soql) {
            model.forcetk().query(soql, callback, function(request) {
            });
        }

    });

    var model = {

        _cache : {},

        database : function() {
            if (model._cache.db === undefined) {
                model._cache.db = window.openDatabase(
                    "salesreport",
                    "1.0",
                    "Sales Report",
                    100000);
            }
            return model._cache.db;
        },

        forcetk : function() {
            if (model._cache.forcetk === undefined) {
                var config = model.OAuth.config;
                model._cache.forcetk =
                 new forcetk.Client(config.clientId, config.loginUrl);
                model._cache.forcetk.setRedirectUri(config.redirectUri);
            }
            return model._cache.forcetk;
        },

        Calendar : common.extend({
        }),

        Report : common.extend({
            tableName : "REPORT",
            sfObjectName : "Report__c"
        }, {
            resync : function() {
                setTimeout(function() {
                    var networkState = navigator.network.connection.type;
                    if (Connection.UNKNOWN !== networkState) {
                        var sql = "SELECT * FROM REPORT WHERE sync_status='2'";
                        model.Report.query(sql, [],
                            function(tx, results) {
                                var list = new collection.Reports();
                                var len = results.rows.length;
                                for (var i = 0; i < len; i++) {
                                    var report = new model.Report(results.rows.item(i));
                                    report.sync();
                                }
                            }
                        );
                    }
                    model.Report.resync();
                }, 5000);
            }
        }),

        Client : common.extend({
            tableName : "CLIENT"
        }, {
            fetchMaster : function() {
                model.Client.fetch(
                    function(response) {
                        var records = response.records;
                        for(var i = 0; i < records.length; i++) {
                            var client = new model.Client({
                                "sfid" : records[i].Id,
                                "name" : records[i].Name
                            });
                            client.save(null, {upsert : true});
                        }
                    },
                     "SELECT Id, Name FROM Client__c"
                );
            }
        }),

        Destination : common.extend({
            tableName : "DESTINATION"
        }, {
            fetchMaster : function() {
                model.Destination.fetch(
                    function(response){
                        var records = response.records;
                        for(i = 0; i < records.length; i++) {
                            var destination = new model.Destination({
                                "sfid" : records[i].Id,
                                "name" : records[i].Name,
                                "address" : records[i].Address__c
                            });
                            destination.save(null, {upsert : true});
                        }
                    },
                    "SELECT Id, Name, Address__c FROM Destination__c"
                );
            }
        }),

        OAuth : common.extend({

            tableName : "OAUTH",

            authenticate : function(callback) {

                var forcetk = model.forcetk();
                this.findAll(function(tx, results){
                    if(results.rows.length > 0) {
                        var accessToken = results.rows.item(0).accessToken;
                        var refreshToken = results.rows.item(0).refreshToken;
                        var instanceUrl = results.rows.item(0).instanceUrl;
                        forcetk.setSessionToken(accessToken,null,instanceUrl);
                        forcetk.setRefreshToken(refreshToken);
                        callback.call(this);
                    
                    } else {
                        window.cb = window.plugins.childBrowser;
                        cb.onLocationChange = function(loc) {
                            if (forcetk.isRedirectUri(loc)) {
                                cb.close();
                                forcetk.sessionCallback(unescape(loc),
                                    function() {
                                        var oauth = new model.OAuth({
                                            "accessToken" : forcetk.sessionId,
                                            "refreshToken" : forcetk.refreshToken,
                                            "instanceUrl" : forcetk.instanceUrl
                                        });
                                        oauth.save();
                                        callback.call(this);
                                    }
                                );
                                
                            }
                        };
                        cb.showWebPage(forcetk.getAuthUrl());
                    }
                });
            }

        }, {
            config : {
                loginUrl: "https://login.salesforce.com/",
                clientId: "3MVG9QDx8IX8nP5S8IEib7PVRMHBonEGiDGG.7TBMpisUiiuAfASQrKVOkU5RMP5yoWeArkRI5vVN6zKpMse6",
                redirectUri: "https://login.salesforce.com/services/oauth2/success"
            }

        }),

        Picture : common.extend({
            tableName : "PICTURE"
        })
    };

    root.model = model;

}).call(window);
