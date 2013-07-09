define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        pointY: 0,

        initialize: function() {
            this.render();
        },

        render: function() {

            // header            
            var header = this.template("#index-header-template");
            $(".header").empty().append(header);
            $(".title").html("マイファーム");

            // contents
            $(this.template('#index-template')).slide();
        }
    });

});

