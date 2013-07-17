define(['view', 'jquery'],

function(CommonView, $) {

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

            $(".camera-icon").on("touchend", this.touchCameraIcon);

            var laughIcon = $(".icon-emo-laugh");
            var happyIcon = $(".icon-emo-happy");
            var unhappyIcon = $(".icon-emo-unhappy");
            var iconDefaultColor = "#666";

            var form = $("#new-report");

            laughIcon.on("touchstart", function() {
                $(this).css("color", "#d00");
                happyIcon.css("color", iconDefaultColor);
                unhappyIcon.css("color", iconDefaultColor);
                form.data("emotion", "laugh");
            });

            happyIcon.on("touchstart", function() {
                $(this).css("color", "#fa0");
                laughIcon.css("color", iconDefaultColor);
                unhappyIcon.css("color", iconDefaultColor);
                form.data("emotion", "happy");
            });

            unhappyIcon.on("touchstart", function() {
                $(this).css("color", "#0ff");
                laughIcon.css("color", iconDefaultColor);
                happyIcon.css("color", iconDefaultColor);
                form.data("emotion", "unhappy");
            });
        },

        touchCameraIcon: function() {
            navigator.camera.getPicture(
                function(imageUri) {
                    $("#camera").empty().append('<img src="' + imageUri + '" width="300" height="300" />');
                },
                function() {},
                {
                    allowEdit : true,
                    targetWidth: 600,
                    targetHeight: 600,
                    saveToPhotoAlbum: true
                }
            );
        }
    });

});

