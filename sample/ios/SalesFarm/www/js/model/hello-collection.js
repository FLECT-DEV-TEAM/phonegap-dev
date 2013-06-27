define(['collection', 'model/hello-model'], function(CommonCollection, HelloModel) {

    return CommonCollection.extend({
        model: HelloModel,
        tableName: 'HELLO'
    });

});

