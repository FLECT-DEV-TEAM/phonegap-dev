if (forcetk.Client) {

    var PERSISTENCE_KEY = "jp.co.flect.oauth";

    forcetk.Client.prototype.setSessionToken = function(sessionId, apiVersion, instanceUrl) {
        this.sessionId = sessionId;
        this.apiVersion = (typeof apiVersion === 'undefined' || apiVersion === null) ? 'v24.0': apiVersion;
        if (typeof instanceUrl === 'undefined' || instanceUrl === null) {
            // location.hostname can be of the form 'abc.na1.visual.force.com' or
            // 'na1.salesforce.com'. Split on '.', and take the [1] or [0] element
            // as appropriate
            var elements = location.hostname.split(".");
            var instance = (elements.length == 3) ? elements[0] : elements[1];
            this.instanceUrl = "https://" + instance + ".salesforce.com";
        } else {
            this.instanceUrl = instanceUrl;
        }
        this._persist(this.sessionId, this.refreshToken, this.instanceUrl);

    };

    forcetk.Client.prototype.authenticate = function(callback) {

        var self = this;
        var item = window.localStorage.getItem(PERSISTENCE_KEY);

        if (item !== null) {
            var oauth = JSON.parse(item);
            var accessToken = oauth.accessToken;
            self.setRefreshToken(oauth.refreshToken);
            self.setSessionToken(oauth.accessToken,null,oauth.instanceUrl);
            if (callback) {
                callback.call(self);
            }

        } else {
            var url = self._getAuthUrl();
            var ref = window.open(url, '_blank');
            ref.addEventListener('loadstop', function(e) {
                if (self._isRedirectUri(e.url)) {
                    ref.close();
                    self._sessionCallback(unescape(e.url),
                        function() {
                            self._persist(self.sessionId,
                                self.refreshToken,
                                self.instanceUrl);
                        }
                    );
                }
            });

        }

    };

    forcetk.Client.prototype._getAuthUrl = function() {
        return this.loginUrl + "services/oauth2/authorize?display=touch" +
                "&response_type=token&client_id=" + this.clientId +
                "&redirect_uri=" + this.redirectUri;
    };

    forcetk.Client.prototype._isRedirectUri = function(uri) {
        return uri.lastIndexOf(this.redirectUri, 0) === 0;
    };

    forcetk.Client.prototype._sessionCallback = function(loc, callback) {
        var oauthResponse = {};

        var fragment = loc.split("#")[1];

        if (fragment) {
            var nvps = fragment.split("&");
            for (var nvp in nvps) {
                var parts = nvps[nvp].split("=");
                oauthResponse[parts[0]] = unescape(parts[1]);
            }
        }

        this.setSessionToken(oauthResponse.access_token, null, oauthResponse.instance_url);
        this.setRefreshToken(oauthResponse.refresh_token);
        callback.call(this);
    };

    forcetk.Client.prototype._persist = function(sessionId, refreshToken, instanceUrl) {
        // Persist to local strage.
        window.localStorage.setItem(
            PERSISTENCE_KEY,
            JSON.stringify({
                "accessToken": sessionId,
                "refreshToken": refreshToken,
                "instanceUrl": instanceUrl
            })
        );
    };

}