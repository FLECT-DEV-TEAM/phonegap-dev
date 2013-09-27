'use strict';

requirejs.config({

  baseUrl: 'js',

  paths: {
    jquery: 'lib/jquery-2.0.0',
    handlebars: 'lib/handlebars',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    forcetk: 'lib/forcetk',
    uuid: 'lib/uuid',
    pageslider: 'lib/pageslider',
    fastclick: 'lib/fastclick'
  },

  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    'forcetk': {
      deps: ['jquery'],
      exports: 'forcetk'
    },
    'uuid': {
      exports: 'UUID'
    },
    'pageslider': {
      deps: ['jquery'],
      exports: 'PageSlider'
    },
    'fastclick': {
      exports: 'FastClick'
    }

  }
});

require(['init', 'jquery', 'fastclick'], function(init, $, FastClick) {
  document.addEventListener('deviceready', init.onDeviceReady, false);
  $(function() {
    FastClick.attach(document.body);
  });
});