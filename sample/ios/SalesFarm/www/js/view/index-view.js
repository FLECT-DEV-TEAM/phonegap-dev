define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#index-view",

        initialize: function() {
            this.render();
        },

        render: function(params) {
            $(this.template('#index-template')).slide();
        }
    });

});

