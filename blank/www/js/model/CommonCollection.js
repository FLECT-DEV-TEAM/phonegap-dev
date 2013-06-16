define(['forcetk-extend', 'model/CommonModel', 'db'], function(forcetk, CommonModel, db) {

    /** 
    * Backbone.Collectionを拡張した共通モデルです。
    * 
    * @class CommonCollection
    */
    return Backbone.Collection.extend({

        /** 
         * Salesforceからデータを取得します。
         * 結果はコレクションに内包されたモデルにバインドされ、すべての結果がバインドされるとadd:allイベントが発生します。
         * 結果が0件の場合はnotfoundイベントが発生します。
         * SalesforceがHTTPステータス200以外の結果を返却したときはfailイベントが発生します。
         * 
         * Salesforceから返却されたデータは以下の法則でモデルにバインドされます。
         * ・Idはsfidという属性になる Id -> model.set({"sfid" : value})
         * ・その他は__cを削除した属性になる xyz__c -> model.set({"xyz" : value})
         *         
         * @param {String} soql SalesforceにリクエストするSOQL
         * @param {Object} options
         *                 save: true 取得して得たモデルをデータベースに保存する
         */
        fetch: function(soql, options) {
            var that = this;
            var i, len;
            forcetk.query(
                soql,
                function(response) {
                    var records = response.records;
                    len = records.length;
                    if (len < 1) {
                        that.trigger("notfound");
                        return;
                    }
                    var models = [];
                    for(i = 0; i < len; i++) {
                        var modelAttr = {};
                        var model = new that.model(null, {noId: true});
                        for (var attr in records[i]) {
                            if (attr === "attributes") {
                                continue;
                            } else if (attr === "Id") {
                                modelAttr["sfid"] = records[i][attr];
                            } else if (attr === "lid__c") {
                                modelAttr["id"] = records[i][attr];
                            } else if (attr === "Name") {
                                modelAttr[that.sfRecordName] = records[i][attr];
                            } else {
                                var renamed = attr.replace("__c", "");
                                modelAttr[renamed] = records[i][attr];
                            }
                        }
                        models.push(model.set(modelAttr));
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
                    that.trigger("failure");
                }
            );
        },

        /** 
         * データベースを検索します。
         * 結果はコレクションに内包されたモデルにバインドされ、すべての結果がバインドされるとadd:allイベントが発生します。
         * 結果が0件の場合はnotfoundイベントが発生します。
         * 
         * @param {String} sql SQL
         * @param {Array} params パラメータ (options)
         * @throws {Error} パラメータが配列ではない場合
         * @throws {Error} SQL発行時にエラーが発生した場合
         * @throws {Error} トランザクション取得時にエラーが発生した場合         
         */
        query: function(sql, params) {
            if ( params && !(params instanceof Array)) {
                throw new Error("paramsは配列である必要があります。");
            }
            var that = this;
            db.getConn().transaction(
                function(tx) {
                    console.log("[SQL]" + sql + "[Params]"+ params);
                    tx.executeSql(
                        sql,
                        params,
                        function(tx, results){
                            var len = results.rows.length;
                            var models = [];
                            if (len < 1) {
                                that.trigger("notfound");
                            } else {
                                for (var i = 0; i < len; i++) {
                                    models.push(new that.model(results.rows.item(i)));
                                }
                                that.add(models);
                                that.trigger("add:all");
                            }
                        },
                        function(err) {
                            throw new Error("ErrorCode:[" + err.code + "] " + err.message);
                        }
                    );
                },
                function(err) {
                    throw new Error("ErrorCode:[" + err.code + "] " + err.message);
                }
            );
        },

        /** 
         * モデルに対応するテーブルから全件検索します。
         * 結果はコレクションに内包されたモデルにバインドされ、すべての結果がバインドされるとadd:allイベントが発生します。
         * 結果が0件の場合はnotfoundイベントが発生します。
         * 
         * @throws {Error} テーブル名が設定されていない場合
         * @throws {Error} SQL発行時にエラーが発生した場合
         * @throws {Error} トランザクション取得時にエラーが発生した場合         
         */
        findAll : function() {
            if (this.tableName === undefined) {
                throw new Error("モデルにtableNameが設定されていません。");
            }
            var that = this;
            db.getConn().transaction(
                function(tx) {
                    tx.executeSql(
                        'SELECT * FROM ' + that.tableName,
                        [],
                        function(tx, results){
                            var len = results.rows.length;
                            var models = [];
                            if (len < 1) {
                                that.trigger("notfound");
                                return;
                            } else {
                                for (var i = 0; i < len; i++) {
                                    models.push(new that.model(results.rows.item(i)));
                                }
                                that.add(models);
                                that.trigger("add:all");
                            }
                        },
                        function(err) {
                            throw new Error("ErrorCode:[" + err.code + "] " + err.message);
                        }
                    );
                },
                function(err) {
                    throw new Error("ErrorCode:[" + err.code + "] " + err.message);
                }
            );
        }

    });

});