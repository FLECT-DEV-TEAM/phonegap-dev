define(['model/CommonModel'], function(CommonModel) {

    return CommonModel.extend({
        tableName : "HELLO",
        sfObjectName : "Hello__c",
        ddl: "CREATE TABLE IF NOT EXISTS HELLO(id primary key, name)"
    });

});

