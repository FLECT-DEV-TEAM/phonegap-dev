# Webフォントアイコン

Webフォントを利用して文字をアイコンとして利用する方法です。

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/tips/webfont_icon_img01.png?raw=true">

## Webフォントを使うメリット

* アイコン画像デザインの手間がありません
* テキストなのでCSSでサイズや色などがデザインできます。サイズが大きくなっても劣化しません。

## サンプル

_WebSymbols Typeface_ というWebフォントのサンプルが以下にあります。

[http://kudakurage.com/test/safari_on_ios5/websymbols/](http://kudakurage.com/test/safari_on_ios5/websymbols/)

しかし公式サイトは最近ロシア語化されてしまって、コンテンツがあるのかどうかすらわからない状況になってしまいました。
そんなこともあって他の有力なWebフォントも探しています。いいのがあったら教えてください。

[http://www.justbenicestudio.com/studio/websymbols/](http://kudakurage.com/test/safari_on_ios5/websymbols/)

## 使い方

### フォントファイルの配置

wwwディレクトリ直下にfontsディレクトリを作ります。fontsディレクトリの中に以下のファイルを配置します。

* websymbols-regular-webfont.eot
* websymbols-regular-webfont.svg
* websymbols-regular-webfont.ttf
* websymbols-regular-webfont.woff

ファイルは[ __こちら__ ](https://github.com/FLECT-DEV-TEAM/phonegap-dev/tree/master/blank/www/fonts)にあります。

### CSS

CSSに以下設定してください。

```css
.icon {
    font-family: 'WebSymbolsRegular';
}

@font-face {
    font-family: 'WebSymbolsRegular';
    src: url('../fonts/websymbols-regular-webfont.eot');
    src: url('../fonts/websymbols-regular-webfont.eot?#iefix') format('embedded-opentype'),
         url('../fonts/websymbols-regular-webfont.woff') format('woff'),
         url('../fonts/websymbols-regular-webfont.ttf') format('truetype'),
         url('../fonts/websymbols-regular-webfont.svg#WebSymbolsRegular') format('svg');
}
```

### HTML

`&gt;`、`+`といった文字がアイコンとして表示されます。

```html
<!-- 「日付リスト」のやじるしアイコン -->
<div class="icon"><span>&gt;</span></div>

<!-- 「あたらしいレポート」のプラスアイコン -->
<div class="icon"><span>+</span></div>
```
