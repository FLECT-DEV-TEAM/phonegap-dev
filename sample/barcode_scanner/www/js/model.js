(function() {

    var root = this;

    // Application Common Model.
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

        query: function(sql, params) {
            // FIXME sqlが文字列かparamsが配列かをチェックしたほうがいい！
            var that = this;
            model.database().transaction(
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
        // class methods.
        _query: function(sql, params, callback) {
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
        }
    });

    var model = {

        _cache : {},

        database : function() {
            if (model._cache.db === undefined) {
                model._cache.db = window.openDatabase(
                    "barcodescanner",
                    "1.0",
                    "Barcode Scanner",
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

        /****************************** Define Application models. */
        Item : common.extend({

            tableName : "ITEM",

            sfObjectName : "Item__c",

            initialize: function(code) {
                if (code === "undefined") {
                    throw new Error('code is required ><');
                }
                this.set(code);
            },

            request: function() {
                var self = this;
                $.ajax({
                    url: "http://immense-shelf-1535.herokuapp.com/search/" + self.get("code"),
                    type: "GET",
                    dataType: "json"
                })
                .done(function(data) {
                    // binding...
                    self.set(data);
                    // trigger success event.
                    self.trigger("request:success");
                })
                .fail(function(data) {
                    // trigger failure event.
                    self.trigger("request:failure");
                });


            }
        }),

        Order : common.extend({
            tableName : "ITEM_ORDER",
            sfObjectName : "ItemOrder__c"
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
                clientId: "xxx", // Your Client ID.
                redirectUri: "https://login.salesforce.com/services/oauth2/success"
            }

        })
    };

    root.model = model;

}).call(window);
