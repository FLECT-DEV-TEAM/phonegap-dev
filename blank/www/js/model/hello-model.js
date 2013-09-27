define(['model'], function(CommonModel) {

  'use strict';

  return CommonModel.extend({
    tableName: 'HELLO',
    sfObjectName: 'Hello__c',
    sfRecordName: 'name'
  }, {
    ddl: 'CREATE TABLE IF NOT EXISTS HELLO(id primary key, name)'
  });

});

