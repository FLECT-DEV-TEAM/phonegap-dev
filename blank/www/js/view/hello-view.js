define(['view', 'jquery'], function(CommonView, $) {

  'use strict';

  return CommonView.extend({

    el: '#top-page',

    initialize: function() {
      this.render();
    },

    render: function() {
      $(this.template('#top-page-template')).slide();
    }
  });

});