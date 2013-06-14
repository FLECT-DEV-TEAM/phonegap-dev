require.config({
  urlArgs: Math.random(),
  paths: {

    // Jasmine
    jasmine: 'lib/jasmine',
    'jasmine-html': 'lib/jasmine-html',

    // sinon
    sinon: 'lib/sinon',

    // oss libraries
    jquery: '../www/js/lib/jquery-2.0.0',
    underscore: '../www/js/lib/underscore',
    backbone: '../www/js/lib/backbone',
    uuid: '../www/js/lib/UUID',
    forcetk: '../www/js/lib/forcetk',

    // 共通ライブラリ
    'forcetk-extend': '../www/js/forcetk-extend',
    'db': '../www/js/db',

    // モデル
    model: '../www/js/model/',

    // テストモジュール
    spec: 'spec'

  },
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    forcetk: {
      deps: ["jquery"],
      exports: "forcetk"
    },
    uuid: {
       exports: "UUID"
    },
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    sinon: {
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
  specs.push('spec/dbSpec');
  specs.push('spec/model/CommonModelSpec');
  specs.push('spec/model/CommonCollectionSpec');

  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });
});