define(['collection', 'model/report-model'], function(CommonCollection, ReportModel) {

  'use strict';

  return CommonCollection.extend({
    model: ReportModel,
    tableName: 'REPORT'
  });

});

