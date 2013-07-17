define(['collection', 'model/report-model'], function(CommonCollection, ReportModel) {

    return CommonCollection.extend({
        model: ReportModel,
        tableName: 'REPORT'
    });

});

