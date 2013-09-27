define(['router', 'backbone', 'model/report-model', 'db', 'pageslider', 'jquery'], function(router, Backbone, ReportModel, db, PageSlider, $) {

  'use strict';

  var init = {

    onDeviceReady: function() {
      init._createTable();
    },

    _createTable: function() {
      db.getConn().transaction(
        // create table.
        function(tx) {
          tx.executeSql(ReportModel.ddl);
        },
        // if create on error.
        function(err) {
          alert(err.code);
          alert(err.message);
        },
        // if create on success.
        function() {
          init._startApp();
        }
      );
    },

    _startApp: function() {
      var slider = new PageSlider($('#container'));
      $.fn.extend({
        slide: function() {
          slider.slidePage(this);
        }
      });
      Backbone.history.start();
      router.navigate('index', {trigger: true});
    }
  };

  return init;

});