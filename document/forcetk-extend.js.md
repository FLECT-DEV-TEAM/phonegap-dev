# forcetk-extend.js

Salesforceと通信をするための`forcetk.js`の拡張モジュールです。`forcetk.Client.prototype`に認証の振る舞いを追加しています。

https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/blank/www/js/forcetk-extend.js

```javascript
if (forcetk.Client) {

    // ローカルストレージにアクセストークンを永続化するためのキー
    var PERSISTENCE_KEY = "jp.co.flect.oauth";

    forcetk.Client.prototype.setSessionToken = function(sessionId, apiVersion, instanceUrl) {
       ...
    };

    forcetk.Client.prototype.authenticate = function(callback) {
       ...
    };

    forcetk.Client.prototype._persist = function(sessionId, refreshToken, instanceUrl) {
       ...
    };

    forcetk.Client.prototype._getAuthUrl = function() {
       ...
    };

    forcetk.Client.prototype._isRedirectUri = function(uri) {
       ...
    };

    forcetk.Client.prototype._sessionCallback = function(loc, callback) {
       ...
    };

}
```

## 前提条件

PhoneGapのAPIである[InAppBrowser](http://docs.phonegap.com/en/2.6.0/cordova_inappbrowser_inappbrowser.md.html)が利用できる必要があります。手順通りにプランクプロジェクトを作っている場合は特別なセットアップは不要です。

## プロトタイプ定義

### authenticate(callback)

Salesforceが提供するOAuthを利用して認証処理を行います。

```javascript
//app.js
var app = {

    setup: {
        ...

        onDeviceReady: function() {
            ...
            // 認証処理
            model.forcetk().authenticate(app.setup.startApp);
        },

        startApp: function() {
            ...
        }

    },
};
```

#### `callback`

認証成功時に呼び出されるコールバック関数を指定します。

### setSessionToken(sessionId, apiVersion, instanceUrl)

アクセストークン要求の結果を自分のプロパティとして格納します。アプリケーション側が明示的に呼び出すことはありません。この処理は`forcetk.js`の`setSessionToken`プロトタイプ定義の上書きです。

唯一以下の点が`forcetk.js`の定義と異なります。
```javascript
// ローカルストレージに認証情報を永続化する
this._persist(this.sessionId, this.refreshToken, this.instanceUrl);
```

## 認証

認証の定義についてまとめます。

### 認証済の定義

 OAuthアクセストークン要求で得たレスポンスを _認証情報_ とし、 これがアプリケーション内に存在する状態を _認証済_ とします。

 * 認証情報

 	_認証情報_ は以下の要素で構成されます

  	* _アクセストークン_
  	* _リフレッシュトークン_ 
  	* _SFインスタンスのURL_  

### 認証情報の永続化

デバイス特性上、アプリを起動するたびにSalesforceとのOAuth認可セッションを最初から毎回行うのはユーザビリティを低下させます。そのため _認証情報_ は _ローカルストレージ_ に格納して永続化しておきます。アプリケーション起動時はまず _ローカルストレージ_ を検索し、 _認証情報_ が存在しない場合のみOAuth認可セッションをSalesforceに要求します。

### 認証情報の更新

SalesforceとのAPI通信の際に _アクセストークン_ の有効期限が切れていた場合、 _リフレッシュトークン_ を用いて _アクセストークン_ の更新要求をSalesforceに行います。これによって _認証情報_ が更新され、API通信が常に有効な状態として保たれます。この処理は`forcetk.js`内に閉じた実装で行われるため、アプリ側が意識することはありません。

 更新された _認証情報_ は`forcetk.Client.prototype.setSessionToken()`にて自動的に _ローカルストレージ_ に再格納されます。

### 再認証

以下に該当する場合は _再認証_ が必要になります。_再認証_ とはSalesforceとのOAuth認可セッションを最初から行うことを指します。

* ローカルストレージに _認証情報_ がない

	なんらかの理由でアプリ起動時にローカルストレージから情報がとれないケースです

* _認証情報_ の更新に失敗したとき

	_認証情報の更新_ を行ったときに _リフレッシュトークン_ が無効なため _アクセストークン_ の更新に失敗したケースです

### トークンについて

| トークン | API通信上の役割 | アプリケーション認証上の役割 | 有効期限 |
|:-----------|:--------------|:------------------|:----------|
| アクセストークン  | APIを利用するためのトークン | アプリ内に存在すれば認証 | 設定>セキュリティのコントロール>セッションの設定>セッションタイムアウトの値 |
| リフレッシュトークン  | アクセストークンを再発行するためのトークン | API利用時に無効であれば再認証 | 原則無期限。ただしユーザ操作で無効化は可能(設定>個人情報>リモートアクセス>取り消し) |

つまり、一度 _認証済_ になったら _リフレッシュトークン_ を無効化されない限り(そういう操作するひとはたぶんあまりいない) ずっと _認証済_ です。

### `authenticate()`解説

上記をふまえて`authenticate()`が何をやっているのか。

```javascript
    forcetk.Client.prototype.authenticate = function(callback) {

        var self = this;

        // ローカルストレージから「認証情報」を取得
        var item = window.localStorage.getItem(PERSISTENCE_KEY);

        // 取得できた場合
        if (item !== null) {

        	// 「認証情報」はJSON形式
            var oauth = JSON.parse(item);

            // 「認証情報」を自分自身にセット
            // 永続化はsetSessionTokenのなかで行われる
            var accessToken = oauth.accessToken;
            self.setRefreshToken(oauth.refreshToken);
            self.setSessionToken(oauth.accessToken,null,oauth.instanceUrl);

        // 取得できなかった場合
        } else {
        	// OAuth認可エンドポイントのURLを取得
            var url = self._getAuthUrl();

            // 上記URLにアクセス、OAuth認可画面が表示される
            var ref = window.open(url, '_blank');

            ref.addEventListener('loadstop', function(e) {
                // OAuthコールバックのURLと同じになったらOAuthセッション成功とみなす
                if (self._isRedirectUri(e.url)) {
                    // 画面をクローズ
                    ref.close();
                    // 「認証情報」を自分自身にセット
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

        if (callback) {
                // 「認証済」としてコールバックを呼び出す
                callback.call(self);
        }

    };
```



