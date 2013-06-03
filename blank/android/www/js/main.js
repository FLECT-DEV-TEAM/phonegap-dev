requirejs.config({

    baseUrl: 'js',

    paths:{
        jquery: 'lib/jquery-2.0.0',
        handlebars: 'lib/handlebars',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        forcetk: 'lib/forcetk',
        UUID: 'lib/UUID'
    },

    shim: {
        "jquery": {
            exports: "jQuery"
        },
        "handlebars": {
            exports: "Handlebars"
        },
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "forcetk": {
            deps: ["jquery"],
            exports: "forcetk"
        },
        "uuid": {
            exports: "UUID"
        }
    }
});

require( ['init'], function(init) {
    document.addEventListener('deviceready', init.onDeviceReady, false);
});