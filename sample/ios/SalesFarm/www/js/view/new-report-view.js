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
            $(".title").html("");

            // contents
            $(this.template('#new-report-template')).slide();
        }
    });

});

