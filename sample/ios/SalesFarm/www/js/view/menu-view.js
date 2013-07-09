define(['view', 'jquery'],

function(CommonView, $) {

    return CommonView.extend({

        el: "#menu-view",

        initialize: function() {
            this.render();
        },

        render: function() {

            // マイファーム画面でスクロールされている場合があるためリセットする
            window.scrollTo(0, 0);

            // header
            var header = this.template("#menu-header-template");
            $(".header").empty().append(header);
            $(".title").html("nishinaka_s");

            // contents
            $(this.template('#menu-template')).slide();
        }
    });
});