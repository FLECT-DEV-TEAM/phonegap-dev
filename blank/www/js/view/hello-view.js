define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#top-page",

        initialize: function() {
            this.render();
        },

        render: function(params) {
            $(this.template('#top-page-template')).slide();
        }
    });

});

