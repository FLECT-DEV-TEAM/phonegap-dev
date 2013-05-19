var app = {

    setup: {
        initialize: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        onDeviceReady: function() {
            // initialize database.
            var db = model.database();
            // begin transaction.
            db.transaction(
                // create table.
                function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS REPORT(id primary key, year, month, day, start, end, subject, ' +
                     'visiting, client, content, sync_status, reg_time)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS DESTINATION(sfid primary key, name, address)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS CLIENT(sfid primary key, name)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS PICTURE(uri primary key, comment, report_id)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS OAUTH(accessToken primary key, refreshToken, instanceUrl)');
                },
                // if create on error.
                function(err) {
                    alert(err.code);
                    alert(err.message);
                },
                // if create on success.
                function() {
                    // process OAuth.
                    new model.OAuth().authenticate(app.setup.startApp);
                }
            );
        },

        startApp: function() {

            // Fetch master from SF and save to SQLite.
            new collection.Clients()
                .fetch("SELECT Id, Name FROM Client__c",
                    {save : {upsert : true}}
                );
            new collection.Destinations()
                .fetch("SELECT Id, Name, Address__c FROM Destination__c",
                    {save : {upsert : true}});

            // Re-sync report to Salesforce.
            model.Report.resync();

            // initialize filesystem.
            window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                function(fileSystem) {
                    app.persistentDirEntry = fileSystem.root;
                },
                function(error) {
                    console.log("file system error." + error.code);
                }
            );
            
            // initialize Tab bar.
            window.plugins.nativeControls.createTabBar();
            window.plugins.nativeControls.createTabBarItem(
             "report",
                "レポートの一覧",
                "",
                {"onSelect" :
                    function() {
                        $("#list-page").show();
                        $("#add-page").hide();
                    }
                }

            );
            window.plugins.nativeControls.createTabBarItem(
             "settings",
                "設定",
                "",
                {"onSelect" :
                    function() {
                        alert("設定");
                    }
                }
            );
            window.plugins.nativeControls.showTabBar();
            window.plugins.nativeControls.showTabBarItems("report", "settings");
            window.plugins.nativeControls.selectTabBarItem("report");

            // initialize Backbone Controller.
            app.router = new router.Router();
            app.router._cache.transition = new Transition();
            Backbone.history.start();

            // START APPLICATION!!
            app.router.navigate("report", {trigger: true});
        }
    },


    util: {
        // TODO Move to Model.
        getTime: function() {
            var now = new Date();
            var year = now.getYear() + 1900;
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var date = ("0" + (now.getDate())).slice(-2);
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
    }

};
