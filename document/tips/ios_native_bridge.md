# [iOS]PhoneGapのネイティブブリッジ方式

Objective-C側はきっちり追ってないですが、大筋あってるはず。PhoneGap2.6.0で確認。

## 方式の概要

ネイティブ呼び出しのJavaScriptAPIを利用すると、特定のURLでリクエストが送信される。このURLに対するリクエストをWebView(`CDVViewController`)がフックして、ネイティブで実装されたプラグインを実行する。
ネイティブ呼び出しのための情報(プラグイン名など)は _コマンド_ と呼ばれ、cordova.js内の _コマンドキュー_ に格納されている。
WebView側が _コマンドキュー_ から _コマンド_ を取り出して適切なネイティブ機能を呼び出す。

リクエスト方式は以下の2通り。

* iframe方式
* XHR方式

## iframe方式

iOS4.2以下の場合はiframe方式。昔はずっとこのやり方だったが色々動作に問題があったようで今はXHR方式になっている。ダミーのiframeを使う。

1. cordova.jsがiframeを生成

	[https://github.com/apache/incubator-cordova-js/blob/master/lib/ios/exec.js#L135](https://github.com/apache/incubator-cordova-js/blob/master/lib/ios/exec.js#L135)

	`gap://ready`というダミーのiframeを生成。

	```javascript
    execIframe = execIframe || createExecIframe();
    execIframe.src = "gap://ready";
	```

2. リクエストのたびに呼ばれるCDVViewController#shouldStartLoadWithRequest

	[https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVViewController.m#L534](https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVViewController.m#L534)

	URLスキームが`gap://`だったら`CDVCommandQueue#fetchCommandsFromJs`が呼び出される

	```objective-c
	/*
	* Execute any commands queued with cordova.exec() on the JS side.
	* The part of the URL after gap:// is irrelevant.
	*/
	if ([[url scheme] isEqualToString:@"gap"]) {
		[_commandQueue fetchCommandsFromJs];
		return NO;
	}
	```

3. _コマンド_ をcordova.jsからフェッチする


	[https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVCommandQueue.m#L69](https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVCommandQueue.m#L69)

	`CDVCommandQueue#fetchCommandsFromJs`の中の、
	`stringByEvaluatingJavaScriptFromString`によってObjective-Cからcordova.jsの`nativeFetchMessages()`が呼び出される

	```objective-c
	- (void)fetchCommandsFromJs
	{
	    // Grab all the queued commands from the JS side.
	    NSString* queuedCommandsJSON = [_viewController.webView stringByEvaluatingJavaScriptFromString:
	        @"cordova.require('cordova/exec').nativeFetchMessages()"];

	    [self enqueCommandBatch:queuedCommandsJSON];
	}
	```

4. commandQueueに格納されているネイティブ呼び出しコマンドJSONをObjective-Cに返却

	[https://github.com/apache/incubator-cordova-js/blob/master/lib/ios/exec.js#L154](https://github.com/apache/incubator-cordova-js/blob/master/lib/ios/exec.js#L154)

	JSONは`callbackId`, `service`, `action`, `actionArgs`で構成される。これを _コマンド_ と表現している。なおこれはプラグインがネイティブ呼び出しの際に利用する`cordova.exec`の引数でもある。

	```javascript
	iOSExec.nativeFetchMessages = function() {
	    // Each entry in commandQueue is a JSON string already.
	    if (!commandQueue.length) {
	        return '';
	    }
	    var json = '[' + commandQueue.join(',') + ']';
	    commandQueue.length = 0;
	    return json;
	};
	```

5. コマンドの実行

	[https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVCommandQueue.m#L50](https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVCommandQueue.m#L50)

	`CDVCommandQueue#enqueCommandBatch`によって
	Queueに格納されているプラグインコマンドを順番に実行する。実処理は`CDVCommandQueue#executePending`、`CDVCommandQueue#execute`あたり。


## XHR方式

デフォルトのネイティブブリッジ方式。XMLHttpRequestを使ってWebViewにネイティブ利用を通知する。

1. cordova.jsがXHRを利用してHTTPリクエスト

	[https://github.com/apache/incubator-cordova-js/blob/master/lib/ios/exec.js#L127](https://github.com/apache/incubator-cordova-js/blob/master/lib/ios/exec.js#L127)

	```javascript
	execXhr.open('HEAD', "/!gap_exec", true);
	execXhr.setRequestHeader('vc', cordova.iOSVCAddr);
	execXhr.setRequestHeader('rc', ++requestCount);
	if (shouldBundleCommandJson()) {
		execXhr.setRequestHeader('cmds', iOSExec.nativeFetchMessages());
	}
	execXhr.send(null);
	```

2. CDVURLProtocol#canInitWithRequestがリクエストを解析

	[https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVURLProtocol.m#L84](https://github.com/apache/incubator-cordova-ios/blob/master/CordovaLib/Classes/CDVURLProtocol.m#L84)

	URLのパスが`/!gap_exec`だったらiframe方式と同じような流れでネイティブプラグインの実行となる。

	```objective-c
	if ([[theUrl path] isEqualToString:@"/!gap_exec"]) {
	```
