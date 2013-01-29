(function() {

    var root = this;

    var collection = {

        /************* Define Application collections. */
        Xxx : Backbone.Collection.extend({
            model: model.Xxx
        }),

        Yyy : Backbone.Collection.extend({
            model: model.Yyy            
        })
    }

    root.collection = collection;

}).call(window);