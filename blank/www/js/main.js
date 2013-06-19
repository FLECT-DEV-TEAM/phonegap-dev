requirejs.config({

    baseUrl: 'js',

    paths:{
        jquery: 'lib/jquery-2.0.0',
        handlebars: 'lib/handlebars',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        forcetk: 'lib/forcetk',
        uuid: 'lib/UUID',
        pageslider: 'lib/pageslider'
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
        },
        "pageslider": {
            deps: ["jquery"],
            exports: "PageSlider"
        }
    }
});

require( ['init'], function(init) {
    document.addEventListener('deviceready', init.onDeviceReady, false);
});