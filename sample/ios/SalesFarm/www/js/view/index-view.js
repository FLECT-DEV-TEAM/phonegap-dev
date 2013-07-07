define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        initialize: function() {
            this.render();
            $("span").on("click", menu);
        },

        render: function() {
            $(".title").html("My Farm");
            $(".header-left").css("visibility", "hidden");
            $(".header-right").css("visibility", "visible");
            $(this.template('#index-template')).slide();
        },

        menu: function() {
            alert("hogehoge");
            router.navigate("menu", {trigger: true});
        }
    });

});

