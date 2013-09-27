define(['collection', 'model/hello-model'], function(CommonCollection, HelloModel) {

  'use strict';

  return CommonCollection.extend({
    model: HelloModel,
    tableName: 'HELLO'
  });

});