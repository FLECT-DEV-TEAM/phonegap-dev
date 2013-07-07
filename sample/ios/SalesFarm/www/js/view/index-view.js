define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#index-view",

        initialize: function() {
            this.render();
        },

        render: function() {
            $(".title").html("牛久農場");
            $(".ribbon").css("visibility", "visible");
            $(this.template('#index-template')).slide();
        }
    });

});

