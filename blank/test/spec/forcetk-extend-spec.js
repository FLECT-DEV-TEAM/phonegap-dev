define(['forcetk-extend', 'sinon'], function(forcetk, sinon) {

    return describe("forcetk-extend.jsのテスト", function() {

        var PERSISTENCE_KEY = "jp.co.flect.oauth";

        beforeEach(function() {
            window.localStorage.removeItem(PERSISTENCE_KEY);
        });

        afterEach(function() {
            window.localStorage.removeItem(PERSISTENCE_KEY);
        });

        describe("初期化のテスト", function() {
            it("初期化と同時にクライアントIDとログインURLが定義されていること", function() {
                expect(forcetk.clientId).not.toBeUndefined();
                expect(forcetk.loginUrl).not.toBeUndefined();
            });
        });

        describe("_getAuthUrlのテスト", function() {
            it("OAuth認証エンドポイントのURLを返却すること", function() {
                var url = forcetk._getAuthUrl();
                expect(url).not.toBeUndefined();
            });
        });

        describe("_isRedirectUriのテスト", function() {
            it("引数のリダイレクトURLがコンフィグで設定したリダイレクトURLに一致したらtrueを返却すること", function() {
                var isRedirectUri =
                    forcetk._isRedirectUri("https://login.salesforce.com/services/oauth2/success");
                expect(isRedirectUri).toBeTruthy();
            });
            it("引数のリダイレクトURLがコンフィグで設定したリダイレクトURLに一致しなかったらfalseを返却すること", function() {
                var isRedirectUri =
                    forcetk._isRedirectUri("https://login.salesforce.com/services/oauth2/nomatch");
                expect(isRedirectUri).toBeFalsy();
            });
        });

        describe("_sessionCallbackのテスト", function() {
            it("OAuthレスポンスのURLハッシュフラグメントがない場合は例外を送出する", function() {
                var invalidUrl = "https://login.salesforce.com/services/oauth2/success";
                try {
                    forcetk._sessionCallback(invalidUrl, function(){});
                    // 例外となるため評価されない
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).not.toBeUndefined();
                }
            });
            it("OAuthレスポンスのハッシュフラグメントにアクセストークンがない場合は例外を送出する", function() {
                var invalidUrl =
                    "https://login.salesforce.com/services/oauth2/success" +
                    "#refresh_token=b&instance_url=https://c";
                try {
                    forcetk._sessionCallback(invalidUrl, function(){});
                    // 例外となるため評価されない
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).not.toBeUndefined();
                }
            });
            it("OAuthレスポンスのハッシュフラグメントにリフレッシュトークンがない場合は例外を送出する", function() {
                var invalidUrl =
                    "https://login.salesforce.com/services/oauth2/success" +
                    "#access_token=a&instance_url=https://c";
                try {
                    forcetk._sessionCallback(invalidUrl, function(){});
                    // 例外となるため評価されない
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).not.toBeUndefined();
                }
            });
            it("OAuthレスポンスのハッシュフラグメントにインスタンスURLがない場合は例外を送出する", function() {
                var invalidUrl =
                    "https://login.salesforce.com/services/oauth2/success" +
                    "#access_token=a&refresh_token=b";
                try {
                    forcetk._sessionCallback(invalidUrl, function(){});
                    // 例外となるため評価されない
                    expect(true).toBeFalsy();
                } catch (e) {
                    expect(e).not.toBeUndefined();
                }
            });
            it("レスポンスが正しい場合はセッションIDとしてアクセストークン、インスタンスURL、リフレッシュトークンがセットされる", function() {
                var url =
                    "https://login.salesforce.com/services/oauth2/success" +
                    "#access_token=a&refresh_token=b&instance_url=https://c";

                forcetk._sessionCallback(url, function(){});

                expect(forcetk.sessionId).toEqual("a");
                expect(forcetk.refreshToken).toEqual("b");
                expect(forcetk.instanceUrl).toEqual("https://c");
            });
            it("レスポンスが正しい場合はコールバックが実行される", function() {
                var url =
                    "https://login.salesforce.com/services/oauth2/success" +
                    "#access_token=a&refresh_token=b&instance_url=https://c";

                var callback = sinon.spy();
                forcetk._sessionCallback(url, callback);
                expect(callback.calledOnce).toBeTruthy();
            });
        });
        describe("_persistのテスト", function() {
            it("ローカルストレージにOAuth結果が格納されること", function() {

                forcetk._persist("a", "b", "https://c");

                var item = window.localStorage.getItem(PERSISTENCE_KEY);
                var oauth = JSON.parse(item);
                expect(oauth.accessToken).toEqual("a");
                expect(oauth.refreshToken).toEqual("b");
                expect(oauth.instanceUrl).toEqual("https://c");
            });
        });
    });
});
