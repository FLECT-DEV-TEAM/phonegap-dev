if (forcetk.Client) {

    forcetk.Client.prototype.getAuthUrl = function() {
        return this.loginUrl + "services/oauth2/authorize?display=touch"
                + "&response_type=token&client_id=" + this.clientId
                + "&redirect_uri=" + this.redirectUri;
    }

    forcetk.Client.prototype.setRedirectUri = function(uri) {
        this.redirectUri = uri;
    }

    forcetk.Client.prototype.getRedirectUri = function() {
        return this.redirectUri;
    }

    forcetk.Client.prototype.isRedirectUri = function(uri) {
        return uri.lastIndexOf(this.redirectUri, 0) == 0;            
    }

    forcetk.Client.prototype.sessionCallback = function(loc, callback) {
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
        alert(callback);
        callback.call(this);
    }

    forcetk.Client.prototype.setSessionToken = function(sessionId, apiVersion, instanceUrl) {
        this.sessionId = sessionId;
        this.apiVersion = (typeof apiVersion === 'undefined' || apiVersion === null)
        ? 'v24.0': apiVersion;
        if (typeof instanceUrl === 'undefined' || instanceUrl == null) {
            // location.hostname can be of the form 'abc.na1.visual.force.com' or
            // 'na1.salesforce.com'. Split on '.', and take the [1] or [0] element
            // as appropriate
            var elements = location.hostname.split(".");
            var instance = (elements.length == 3) ? elements[0] : elements[1];
            this.instanceUrl = "https://" + instance + ".salesforce.com";
        } else {
            this.instanceUrl = instanceUrl;
        }
        
    }

}