# Webフォントアイコン

Webフォントを利用して文字をアイコンとして利用する方法です。

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/tips/webfont_icon_img01.png?raw=true">

## Webフォントを使うメリット

* アイコン画像デザインの手間がありません
* テキストなのでCSSでサイズや色などがデザインできます。サイズが大きくなっても劣化しません。

## サンプル

ブランク/サンプルでは _fontello_ というサービスを利用します。

[http://fontello.com/](http://fontello.com/)

このサービスの特徴は有名どころのWebフォントのアイコンを選り取ってひとまとめにしてダウンロードできる所です。

メリットとしては
* いろんなサービスのアイコンを一つにまとめて利用できる
* 実際に使用するアイコンに厳選できるのでファイルサイズが小さくなる

というところです。

## 使い方

### アイコンの選択

[http://fontello.com/](http://fontello.com/)
にアクセスして、利用したいアイコンを選択、ダウンロードしてください。

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/tips/webfont_icon_img02.png?raw=true">

ダウンロードしたファイルは解凍します。`demo.html`を開けば後はだいたいわかると思います。

### フォントファイルとcssの配置

解凍したファイルのうち`css`と`font`をwww以下に配置してください。

なお`css`の中にはiOS/Andoroidで利用する場合には不要なcssもあります(fontello-ie7.cssなど)。実際必要なのは`fontello.css`だけなので不要なのものは消してしまってもかまいません。

### HTML

cssを読み込みます。

```css
<link href="css/fontello.css" rel="stylesheet">
```

`<i>`タグの`class`で表示するアイコンを指定します（アイコン名は`demo.html`を見ればわかります）

```html
 <h1>Hello phonegap-dev blank <i class="icon-emo-happy"></i></h1>
```

<img src="https://github.com/FLECT-DEV-TEAM/phonegap-dev/blob/master/document/tips/webfont_icon_img03.png?raw=true">
