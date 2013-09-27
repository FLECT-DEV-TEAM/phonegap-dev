define(['view', 'jquery'], function(CommonView, $) {

  return CommonView.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      // header
      var header = this.template("#new-report-header-template");
      $(".header").empty().append(header);
      $(".title").html("新しい登録");
      // contents
      $(this.template('#new-report-template')).slide();
      this.event();
    },

    event: function() {
      $(".camera-icon").on("touchend", this.camera);
      $("button").on("click", this.save);
    },

    camera: function() {
      navigator.camera.getPicture(
        function(imageUri) {
          $("#camera").empty().append('<img src="' + imageUri + '" width="300" height="300" />');
        }, function() {
        },{
          allowEdit: true,
          targetWidth: 600,
          targetHeight: 600,
          saveToPhotoAlbum: true
        }
      );
    },

    save: function() {
      alert("ほぞんした");
    }
  });

});

