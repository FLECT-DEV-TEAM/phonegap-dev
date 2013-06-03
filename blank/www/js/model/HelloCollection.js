define(['model/CommonCollection', 'model/HelloModel'], function(CommonCollection, HelloModel) {

    return CommonCollection.extend({
        model: HelloModel,
        tableName: 'HELLO'
    });

});

