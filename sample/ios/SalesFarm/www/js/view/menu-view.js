
define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#menu-view",

        initialize: function() {
            this.render();
        },

        render: function(params) {
            $(this.template('#menu-template')).slide();
        }
    });

});

