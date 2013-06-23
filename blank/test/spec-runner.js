require.config({
  urlArgs: Math.random(),
  paths: {

    // Jasmine
    'jasmine': 'lib/jasmine',
    'jasmine-html': 'lib/jasmine-html',

    // sinon
    'sinon': 'lib/sinon',

    // oss libraries
    'jquery': '../www/js/lib/jquery-2.0.0',
    'underscore': '../www/js/lib/underscore',
    'backbone': '../www/js/lib/backbone',
    'uuid': '../www/js/lib/uuid',
    'forcetk': '../www/js/lib/forcetk',
    'handlebars': '../www/js/lib/handlebars',
    'pageslider': '../www/js/lib/pageslider',

    // 共通ライブラリ
    'forcetk-extend': '../www/js/forcetk-extend',
    'db': '../www/js/db',
    'router': '../www/js/router',
    'model': '../www/js/model',
    'view': '../www/js/view',
    'collection': '../www/js/collection',

    'spec': 'spec'

  },
  shim: {
    'underscore': {
      exports: "_"
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'forcetk': {
      deps: ["jquery"],
      exports: "forcetk"
    },
    'uuid': {
       exports: "UUID"
    },
    'handlebars': {
       exports: "Handlebars"
    },
    'pageslider': {
       deps: ["jquery"],
       exports: "PageSlider"
    },

    'jasmine': {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'sinon': {
      exports: 'sinon'
    }
  }
});

require(['jquery', 'jasmine-html'], function($, jasmine){

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [];
  specs.push('spec/db-spec');
  specs.push('spec/router-spec');
  specs.push('spec/forcetk-extend-spec');
  specs.push('spec/view/view-spec');
  specs.push('spec/model/model-spec');
  specs.push('spec/model/collection-spec');

  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });
});