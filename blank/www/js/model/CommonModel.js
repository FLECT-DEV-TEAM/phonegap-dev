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
                throw new Error("モデルにtableNameが設定されていません。");
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
                    var sql = insertSql + tableName + '('+ columns +') ' + 'VALUES (' + preparedStatement + ')';
                    console.log("[SQL]" + sql + "[Params]"+ param);
                    tx.executeSql(sql, param);
                },
                // 実行に失敗
                function(err) {
                    throw new Error("ErrorCode:[" + err.code + "] " + err.message);
                },
                // 実行に成功
                callback()
            );

            // syncオプション
            if (options && options.sync) {
                this.sync();
            }
        },

        /** 
         * Salesforceに同期します。
         *         
         * @param {Function} success  同期成功時に呼び出されるコールバック(option)
         * @param {Function} failure  同期失敗時に呼び出されるコールバック(option)
         * @throws {Error} Salesforceのオブジェクト名が設定されていない場合
         * @throws {Error} Salesforceのレコード名(Name)が設定されていない場合
         * @throws {Error} Salesforceのレコード名(Name)に設定する値が取得できなかった場合
         */
        sync: function(success, failure) {

            // SFオブジェクト名が設定されていない場合はsyncできない
            if(this.sfObjectName === undefined) {
                throw new Error("モデルにsfObjectNameが設定されていません。");
            }
            // SFレコード名が設定されていない場合はsyncできない
            if(this.sfRecordName === undefined) {
                throw new Error("モデルにsfRecordNameが設定されていません。");
            }

            // 必ずNameが必要な前提で一旦よしとする
            // 問題が出たら対応する
            var name = this.get(this.sfRecordName);
            if (name === undefined) {
                throw new Error("レコード名を取得することができませんでした。");
            }
            var obj = {"Name" : name};

            var attributes = this.attributes;
            for (var attribute in attributes) {
                // sync_statusとNameとして指定した属性は除外する
                if (attribute !== "sync_status"  &&
                    attribute !== this.sfRecordName) {
                    obj[attribute + "__c"] = this.get(attribute);
                }
            }

            var that = this;
            // ネットワークがオフラインの場合は同期しない
            if ( _isOffline() ) {
                // 同期ステータスを"2"(非同期)にしてデータベースを更新
                that.set({"sync_status":"2"});
                that.save(
                    function() {
                        console.log("update sync_status 2");
                    }, {upsert : true}
                );
                if (failure !== undefined) {
                    failure();
                }
            // ネットワークがオンラインの場合のみ同期処理を行う
            } else {
                forcetk.create(
                    this.sfObjectName,
                    obj,
                    function() {
                        console.log("success sync:" + obj);
                        // update sync_status (it means already sync to salesforce).
                        that.set({"sync_status":"1"});
                        that.save(
                            function() {
                                console.log("update sync_status 1");
                            }, {upsert : true}
                        );
                        if( success !== undefined ) {
                            success();
                        }
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
                        console.log(jqXHR.responseText);
                    }
                );
            }

            function _isOffline() {
                if (navigator.network === undefined ||
                      navigator.network.connection === undefined) {
                    return true;
                }
                var networkState = navigator.network.connection.type;
                if (Connection === undefined) {
                    return true;
                }
                return Connection.UNKNOWN === networkState;
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
