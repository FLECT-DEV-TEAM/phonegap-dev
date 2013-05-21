define(['jquery', 'router'], function($, router) {

    var Transition = function() {
        var that = this;
        this.history = [];
        this.isBack = false;
        $(window).bind('hashchange', function() {
            that.history.push(location.hash);
        });
    };

    Transition.prototype.show = function($obj, options) {
        // translate manually.
        if (options && options.from && options.to) {
            this._translate($obj, options.from, options.to);
            return;
        }

        if (this.current) {
            this.current.removeClass("current");
            this.current.hide();
            if (options === undefined || options.cleanup !== false) {
                this.current.find(".append").empty();
            }
        }

        this.current = $obj;
        this.current.addClass("current");


        if (options && options.effect === false) {
            $obj.show();
        } else {
            var from = this.isBack ? "100" : "-100";
            this._translate($obj, from, "0");
        }
        this.isBack = false;
    };

    Transition.prototype.back = function() {
        this.isBack = true;
        this.history.pop();
        var priviousUrl = this.history.pop();
        router.navigate(priviousUrl, {trigger: true});
        return false;
    };

    Transition.prototype._translate = function($obj, from, to) {
        $obj.attr({style: "-webkit-transform:translateX(" + from + "%)"});
        $obj.show();
        $obj.attr({style: "-webkit-transform:translateX(" + to + "%)"});
    };

    return Transition;
});