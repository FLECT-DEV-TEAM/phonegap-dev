define(['model'], function(CommonModel) {

    return CommonModel.extend({
        tableName : "REPORT",
        sfObjectName : "SFReport__c",
        sfRecordName : "name"
    }, {
        ddl: "CREATE TABLE IF NOT EXISTS REPORT(id primary key, sfid, name, path, note, sync_status, ins_tm, upd_tm)"
    });

});
