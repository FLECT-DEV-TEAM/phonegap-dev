(function() {

    var root = this;

    var common = Backbone.View.extend({
    
        _cache : {
            template : {}
        },

        template: function(selector, params) {
            var _cache = this._cache.template[selector];
            if (_cache) {
                return _cache(params);
            } else {
                var source = $(selector).html();
                var template = Handlebars.compile(source);
                this._cache.template[selector] = template;
                return template(params);
            }
        },

        show : function($obj, options) {
            app.router._cache.transition.show($obj, options);
        },

        back : function() {
            return app.router._cache.transition.back();
        }

    });

    var view = {

        ListView : common.extend({

            el: "#list-page",

            initialize: function(params) {
                _.bindAll(this, 'render');
                this.render(params);
            },

            render: function(params) {
                if (params.refresh) {

                    var calendar = [];
                    var weeks = ["日","月","火","水","木","金","土"];
                    
                    var now = new Date();
                    for (var i = 0; i < 10; i++) {
                        var year = now.getYear();
                        var month = now.getMonth();
                        var date = now.getDate();
                        var day = now.getDay();
                        var clazz = "";
                        if (day === 0) {
                            clazz = "sunday";
                        }
                        if (day === 6) {
                            clazz = "saturday";
                        }
                        calendar.push({
                            "year": year + 1900,
                            "month": ("0" + (month + 1)).slice(-2),
                            "day": ("0" + date).slice(-2),
                            "clazz" : clazz,
                            "week" : weeks[day]
                        });
                        now.setDate(date + 1);
                    }
                    this.$el
                        .find('.append')
                        .append(this.template('#list-calendar-template', calendar));
                    this.show(
                        this.$el, {effect : app.router._cache.transition.isBack}
                    );

                }

                if (params.date) {
                    this.renderList(params.date);
                }
            },

            renderList: function(date) {
                // clear reports.
                var report = $('#reports');
                report.empty();
                report.css("display","none");

                var sql = "SELECT * FROM REPORT WHERE year=? AND month=? AND day=?";
                var params = [date.year, date.month, date.day];
                var that = this;

                model.Report.query(sql, params,
                    function(tx, results){

                        var list = new collection.Reports();
                        var len = results.rows.length;
                        for (var i = 0; i < len; i++) {
                            list.add(new model.Report(results.rows.item(i)));
                        }

                        var reports = $('#reports');
                        reports.append(that.template("#list-report-template", list.toJSON()));
                        reports.append(that.template("#list-new-template", date));
                        that.show(reports, {from : "-25", to : "0" });
                    }
                );
            }
        }),

        DetailView : common.extend({

            el: "#detail-page",

            events: {
                "click .back" : "back",
                "click .next" : "picture"
            },

            initialize: function(params) {
                _.bindAll(this, 'render', 'picture', 'back');
                this.reportId = params.reportId;
                this.pictures = [];
                this.render(params.reportId);
            },

            render: function(reportId) {
                var that = this;
                model.Report.query(
                    "SELECT * FROM REPORT WHERE id=?",
                    [reportId],
                    function(tx, results) {
                        var report = new model.Report(results.rows.item(0));
                        model.Picture.query(
                            "SELECT * FROM PICTURE WHERE report_id=?",
                            [report.get("id")],
                            function(tx, results) {
                                for(var i = 0; i < results.rows.length; i++) {
                                    that.pictures.push(
                                        new model.Picture(results.rows.item(i)));
                                }
                                if (that.pictures.length > 0) {
                                    report.set("picture", true);
                                }
                                that.$el
                                    .find('.append')
                                    .append(that.template("#report-detail-template", report.toJSON()));
                                that.show(that.$el);
                            }
                        );
                    }
                );
            },

            picture: function() {
                var reportId = this.reportId;
                var that = this;
                var delegate = window.plugins.nativeControls.createActionSheet(
                    ['カメラで撮影','カメラロールから選択']);
                delegate.onActionSheetDismissed = function(index) {
                    if (index === 0) {
                        that.camera(reportId);
                    } else if (index === 1) {
                        that.cameraRoll();
                    }

                };
                return false;
            },

            camera: function(reportId) {
                navigator.camera.getPicture(
                    function(imageUri) {
                        var url = "report/" + reportId + "/" + "comment" + "/" + imageUri;
                        app.router.navigate(
                            url, {trigger: true}
                        );
                    },
                    function(message) {
                        alert(message);
                    },
                    {
                        quality: 75,
                        destinationType: Camera.DestinationType.FILE_URI
                    }
                );
            },

            cameraRoll: function() {
            }
        }),

        PictureView : common.extend({

            el: "#picture-page",

            events: {
                "click .back" : "back"
            },

            initialize: function(params) {
                this.reportId = params.reportId;
                this.page = params.page;
                this.pictures = params.pictures;
                this.render();
            },

            render: function() {

                app.transition.current.find(".append").empty();

                this.$el
                    .find(".navbar-inner")
                    .find(".append")
                    .append(this.template("#picture-detail-header-template", {
                        "page": this.page,
                        "pageCount" : this.pictures.length,
                        "reportId": this.reportId
                    }));

                this.$el
                    .find(".row-fluid")
                    .find(".append")
                    .append(this.template("#picture-detail-template", {
                        "imageUri": this.pictures[this.page].get("uri"),
                        "comment": this.pictures[this.page].get("comment")
                    }));

                this.show(
                    this.$el, {effect : true, cleanup : false}
                );
            }

        }),

        AddView : common.extend({

            el: "#add-page",

            events: {
                "click .submit" : "submit",
                "click .reset" : "reset",
                "click .back" : "back",
                "click .client" : "client",
                "click .visiting" : "visiting"
            },

            initialize: function(params) {

                _.bindAll(this, 'submit', 'reset', 'render');
                this.date = params.date;
                this.render(params.date);
            },

            render: function(date) {
                this.$el
                    .find(".navbar-inner")
                    .append(this.template("#new-report-header-template", date));
                this.show(this.$el);
            },

            client: function() {
                app.router.navigate("client", {trigger: true});
            },

            visiting: function() {
                app.router.navigate("destination", {trigger: true});
            },

            submit: function() {
                var that = this;
                var newReport = new model.Report({
                    "id" : UUID.generate(),
                    "year" : that.date.year,
                    "month" : that.date.month,
                    "day" : that.date.day,
                    "start" : $('#start').val(),
                    "end" : $('#end').val(),
                    "subject" : $('#subject').val(),
                    "visiting" : $('#visiting').text(),
                    "client" : $('#client').text(),
                    "content" : $('#content').val(),
                    "sync_status" : "0",
                    "reg_time" : app.util.getTime()
                });
                newReport.save(function() {
                    navigator.notification.alert(
                        "",
                        function() {
                            that.reset();
                            return that.back();
                        },
                        'レポートを追加しました！',
                        'OK'
                    );
                }, {sync : true});
            },

            reset: function() {
                $('#start').val("");
                $('#end').val("");
                $('#subject').val("");
                var visiting = $('#visiting');
                visiting.text("訪問先を選択する");
                visiting.append('<span class="icon">&gt;</span>');
                var client = $('#client');
                client.text("お客様を選択する");
                client.append('<span class="icon">&gt;</span>');
                $('#content').val("");
            }
        }),

        ClientView : common.extend({

            el: "#client-page",

            events: {
                "click a" : "renderBack"
            },

            initialize: function() {
                _.bindAll(this, "render", "renderBack");
                this.clients = new collection.Clients();
                this.clients.bind("addAll", this.render);
                this.clients.findAll();
            },

            render: function() {
                this.$el
                    .find('.append')
                    .append(this.template("#client-template",
                        this.clients.toJSON()));
                this.show(this.$el);
            },

            renderBack: function(e) {
                var text = $(e.target).html();
                $(".btn.client").text(text);
                return this.back();
            }

        }),

        DestinationView : common.extend({

            el: "#destination-page",

            events: {
                "click a" : "renderBack"
            },

            initialize: function() {
                _.bindAll(this, "render", "renderBack");
                this.destinations = new collection.Destinations();
                this.destinations.bind("addAll", this.render);
                this.destinations.findAll();
            },

            render: function() {
                this.$el
                    .find('.append')
                    .append(this.template("#destination-template",
                        this.destinations.toJSON()));
                    this.show(this.$el);
            },

            renderBack: function(e) {
                var text = $(e.target).html();
                $(".btn.visiting").text(text);
                return this.back();
            }
        }),

        CommentView : common.extend({
            
            el: "#comment-page",

            events: {
                "click .submit" : "submit"
            },

            initialize: function(params) {
                _.bindAll(this, 'render', 'submit');
                this.reportId = params.reportId;
                this.imageUri = params.imageUri;
                this.render();
            },

            render: function() {
                this.$el
                    .find('.append')
                    .append(this.template("#picture-template", {
                        "imageUri": this.imageUri
                    }));
                this.show(this.$el);
            },

            submit: function() {
                var that = this;
                window.resolveLocalFileSystemURI(that.imageUri,
                    function(fileEntry) {
                        fileEntry.moveTo(
                            app.persistentDirEntry,
                            UUID.generate() + ".jpg",
                            function(fileEntry) {
                                var picture = new model.Picture({
                                    "uri": fileEntry.fullPath,
                                    "comment": that.$el.find('textarea').val(),
                                    "report_id": that.reportId
                                });
                                picture.save(function() {
                                    return that.back();
                                });
                            },
                            function(error) {
                                console.log("failure..." + error.code);
                            });
                    }
                );
            }
        })
    };

    root.view = view;

}).call(window);