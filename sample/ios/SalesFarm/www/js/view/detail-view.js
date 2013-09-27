define(['view', 'jquery'], function(CommonView, $) {

  return CommonView.extend({

    initialize: function() {
      this.render();
    },

    render: function() {

      // header
      var header = this.template("#detail-header-template");
      $(".header").empty().append(header);
      $(".title").html("");

      // contents
      $(this.template('#detail-template')).slide();
    }
  });

});