define(['view/CommonView'],

function(CommonView) {

    return CommonView.extend({

        el: "#top-page",

        initialize: function() {
            this.render();
        },

        render: function(params) {
            this.$el
                .find('.append')
                .append(this.template('#top-page-template'));
            this.show(this.$el);
        }
    });

});

