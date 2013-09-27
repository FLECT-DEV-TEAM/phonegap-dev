/* global unescape */
define(['forcetk'], function(forcetk) {

  'use strict';

  if (forcetk.Client) {

    var PERSISTENCE_KEY = 'jp.co.flect.oauth';

    var config = {
      loginUrl: 'https://login.salesforce.com/',
      clientId: 'xxx', //YOUR CLIENT ID
      redirectUri: 'https://login.salesforce.com/services/oauth2/success'
    };

    forcetk.Client.prototype.setSessionToken = function(sessionId, apiVersion, instanceUrl) {
      this.sessionId = sessionId;
      this.apiVersion = (typeof apiVersion === 'undefined' || apiVersion === null) ? 'v24.0' : apiVersion;
      if (typeof instanceUrl === 'undefined' || instanceUrl === null) {
        // location.hostname can be of the form 'abc.na1.visual.force.com' or
        // 'na1.salesforce.com'. Split on '.', and take the [1] or [0] element
        // as appropriate
        var elements = location.hostname.split('.');
        var instance = (elements.length === 3) ? elements[0] : elements[1];
        this.instanceUrl = 'https://' + instance + '.salesforce.com';
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
        self.setRefreshToken(oauth.refreshToken);
        self.setSessionToken(oauth.accessToken, null, oauth.instanceUrl);
        if (callback) {
          callback.call(self);
        }

      } else {
        var url = self._getAuthUrl();
        var ref = window.open(url, '_blank');
        ref.addEventListener('loadstop', function(e) {
          if (self._isRedirectUri(e.url)) {
            ref.close();
            self._sessionCallback(unescape(e.url), function() {
                self._persist(self.sessionId,
                    self.refreshToken,
                    self.instanceUrl);
                if (callback) {
                  callback.call(self);
                }
              }
            );
          }
        });
      }
    };

    forcetk.Client.prototype._getAuthUrl = function() {
      return this.loginUrl + 'services/oauth2/authorize?display=touch' +
          '&response_type=token&client_id=' + this.clientId +
          '&redirect_uri=' + config.redirectUri;
    };

    forcetk.Client.prototype._isRedirectUri = function(uri) {
      return uri.lastIndexOf(config.redirectUri, 0) === 0;
    };

    forcetk.Client.prototype._sessionCallback = function(loc, callback) {
      var oauthResponse = {};

      var fragment = loc.split('#')[1];
      if (!fragment) {
        throw new Error('OAuthのレスポンスが正しくありません');
      }

      var nvps = fragment.split('&');
      for (var nvp in nvps) {
        var parts = nvps[nvp].split('=');
        oauthResponse[parts[0]] = unescape(parts[1]);
      }

      /* jshint camelcase: false */
      var accessToken = oauthResponse.access_token;
      var instanceUrl = oauthResponse.instance_url;
      var refreshToken = oauthResponse.refresh_token;

      if (!accessToken || !instanceUrl || !refreshToken) {
        throw new Error('OAuthのレスポンスが正しくありません');
      }

      this.setSessionToken(accessToken, null, instanceUrl);
      this.setRefreshToken(refreshToken);
      callback.call(this);
    };

    forcetk.Client.prototype._persist = function(sessionId, refreshToken, instanceUrl) {
      // Persist to local strage.
      window.localStorage.setItem(
        PERSISTENCE_KEY,
        JSON.stringify({
          accessToken: sessionId,
          refreshToken: refreshToken,
          instanceUrl: instanceUrl
        })
      );
    };
    return new forcetk.Client(config.clientId, config.loginUrl);
  }
});