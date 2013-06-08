define(['backbone', 'forcetk-extend', 'uuid', 'db'], function(Backbone, forcetk, UUID, db) {

    /** 
    * Backbone.Modelを拡張した共通モデルです。
    * 
    * @class CommonModel
    */
    var CommonModel = Backbone.Model.extend({

        /** 
         * 初期化をします。
         *         
         * @param {Object} attributes 初期値として設定するモデル属性(option)
         */
        initialize: function(attributes) {
            if(attributes) {
                if (attributes.id === undefined) {
                    // id属性がない場合は自動発番
                    attributes.id = UUID.generate();
                }
                this.set(attributes);
            } else {
                this.set({
                    id: UUID.generate()
                });
            }
        },

        /** 
         * データベースに保存します。
         *         
         * @param {Function} callback  保存成功時に呼び出されるコールバック(option)
         * @param {Object} options
         *                 upsert:true UPSERT処理を実行
         *                 sync   :true 保存成功後にSalesforceへの同期処理を実行
         * @throws {Error} テーブル名が設定されていない場合
         * @throws {Error} SQL発行時に保存に失敗した場合
         */
        save: function(callback, options) {

            // テーブル名が設定されていない場合は保存できない
            if (this.tableName === undefined) {
                throw new Error("tableName is not defined.");
            }
            // 成功時のコールバックが設定されていない場合は空ファンクション
            if (callback === undefined) {
                callback = function(){};
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

            // upsertオプション
            if (options && options.upsert) {
                insertSql = "INSERT OR REPLACE INTO ";
            }

             db.getConn().transaction(
                // SQL発行
                function(tx) {
                    tx.executeSql(insertSql + tableName + '('+ columns +') ' +
                        'VALUES (' + preparedStatement + ')', param);
                },
                // 実行に失敗
                function(err) {
                    throw new Error({
                        code: err.code,
                        message: err.message});
                },
                // 実行に成功
                callback()
            );

            // syncオプション
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
            db.getConn().transaction(
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

        _query: function(sql, params, callback) {
            db.getConn().transaction(
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
