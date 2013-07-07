define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#menu-view",

        initialize: function() {
            this.render();
        },

        render: function() {
            $(".title").html("nishinaka_s");
            $(".header-left").css("visibility", "visible");
            $(".header-right").css("visibility", "hidden");
            $(this.template('#menu-template')).slide();
        }
    });
});