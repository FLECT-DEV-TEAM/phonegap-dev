(function() {

    var root = this;

    var common = Backbone.Router.extend({

        _cache : {
            view : {},
            transition : {}
        },

        view: function(name, params) {
            var cache = this._cache.view[name];
            if (cache) {
                cache.initialize(params);
            } else {
                this._cache.view[name] = new view[name](params);
            }
        }
    });

    var controller = {

        Router: common.extend({
            routes: {
                "report": "list",
                "report/:date": "list",
                "report/:date/new": "add",
                "report/:id/detail": "detail",
                "client": "client",
                "destination": "destination",
                "report/:id/comment/*uri": "comment",
                "report/:id/picture/:page": "picture"
            },

            list: function(date) {
                var that = this;
                var params = {
                    date : (function() {
                        if (date !== undefined) {
                            return {
                                "year": date.substring(0,4),
                                "month": date.substring(4,6),
                                "day": date.substring(6,8)
                            };
                        }
                    })(),
                    refresh : (function() {
                        if (that._cache.view["ListView"]) {
                            return that._cache.transition.isBack;
                        } else {
                            return true;
                        }
                    })()
                };
                this.view("ListView", params);
            },

            add: function(date) {
                var params = {
                    date : (function() {
                        return {
                            "year": date.substring(0,4),
                            "month": date.substring(4,6),
                            "day": date.substring(6,8)
                        };
                    })()
                };
                this.view("AddView", params);
            },

            detail: function(id) {
                this.view("DetailView", {reportId : id});
            },

            client: function() {
                this.view("ClientView");
            },

            destination: function() {
                this.view("DestinationView");
            },

            comment: function(reportId, imageUri) {
                this.view("CommentView", {
                    "reportId" : reportId,
                    "imageUri" : imageUri
                });
            },

            picture: function(reportId, page) {
                this.view("PictureView", {
                    "reportId" : reportId,
                    "page" : page,
                    "pictures" : that._cache.view["DetailView"].pictures
                });
            }
        })
    };

    root.controller = controller;

}).call(window);
