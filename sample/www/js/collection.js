(function() {

    var root = this;

    var collection = {
        Calendars : Backbone.Collection.extend({
            model: model.Calendar
        }),
        Reports : Backbone.Collection.extend({
            model: model.Report
        }),
        Clients : Backbone.Collection.extend({
            model: model.Client
        }),
        Destinations : Backbone.Collection.extend({
            model: model.Destination
        })
    };

    root.collection = collection;

}).call(window);