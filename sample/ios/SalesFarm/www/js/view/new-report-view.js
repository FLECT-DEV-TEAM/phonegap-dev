define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#container",

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
        }
    });

});

