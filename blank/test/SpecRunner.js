require.config({
  urlArgs: Math.random(),
  paths: {

    // Jasmineのライブラリ
    jasmine: 'lib/jasmine',
    'jasmine-html': 'lib/jasmine-html',

    // OSSライブラリ
    jquery: '../www/js/lib/jquery-2.0.0',
    underscore: '../www/js/lib/underscore',
    backbone: '../www/js/lib/backbone',
    uuid: '../www/js/lib/UUID',
    forcetk: '../www/js/lib/forcetk',

    // 共通ライブラリ
    'forcetk-extend': '../www/js/forcetk-extend',

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
  specs.push('spec/model/CommonModelSpec');

  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });
});