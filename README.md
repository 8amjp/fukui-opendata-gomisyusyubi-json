# fukui-opendata-gomisyusyubi-json

[福井県オープンデータ](https://www.pref.fukui.lg.jp/gyosei/jouhoukoukai/opendata/index.html)の「[ごみ収集日一覧](https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html)」で公開されている収集日のCSV（Shift-JIS）をJSONに変換します。

## Description

樹里「というわけで、福井県内自治体の[ごみ収集日一覧](https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html)JSONデータを作成するアプリを作ってみた」
絵子「ほう。なんでまた突然」
樹里「それがな、久しぶりに[福井県オープンデータ](https://www.pref.fukui.lg.jp/gyosei/jouhoukoukai/opendata/index.html)に公開されてるデータを使って、Webアプリでも作ってみようとしたんだがな」
絵子「ふむふむ」
樹里「で、ごみ収集日一覧の収集日のデータを見てみたわけなんだが、公開されてるデータがなんとShift-JISのCSVなんだよ。この令和のご時世に」
絵子「うーん。確かにそのままだと扱いにくいよね」
樹里「Shift-JISのCSVなんだよ。この令和のご時世に」
絵子「2回言わなくていいよ」
樹里「これではどうしようもないので、まずはちゃんとしたUTF-8のJSONに変換するアプリから作ってみた」
絵子「なるほど。経緯はよくわかった」

## Usage

樹里「使い方は簡単。[Node.js](https://nodejs.org/ja/)製のアプリなので……」

```
git clone https://github.com/8amjp/fukui-opendata-gomisyusyubi-json.git
cd fukui-opendata-gomisyusyubi-json
npm install
```

樹里「上記のコマンドでインストールして、」

```
node index.js
```

樹里「と実行すれば、`dist`ディレクトリにJSONデータが出力される」
絵子「あら本当に簡単」
樹里「じゃあ、アプリがどういう動きをするのか解説しよう」

### index.js

```js:index.js
/*
  「福井県オープンデータライブラリ」の「ごみ収集日一覧」ページで公開されている
  収集日のCSVデータ（Shift-JIS）をJSONに変換します。
*/

const scraper = require('./lib/scraper')
const generator = require('./lib/generator')

(async () => {
    // 「ごみ収集日一覧」ページのURL
    const page = 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html'
    // ページ内の17市町のCSVデータのURLを取得
    const resources = await scraper.scrape(page)
    // すべてのCSVを取得してJSONに変換して出力
    await Promise.all(resources.map(resource => generator.generate(resource)));
    console.log('exit.')
})();
```

絵子「
樹里「
絵子「
樹里「
絵子「
樹里「
絵子「
樹里「
絵子「

```js:lib/fetcher.js
/*
  指定されたURLのCSVを取得し、文字コードをShift-JISからUTF-8にに変換します。
*/
const fetch = require('node-fetch')

module.exports.fetch = async (url) => {
    const response = await fetch(url)
    const buffer = response.arrayBuffer()
    const decoder = new TextDecoder("Shift_JIS")
    const text = decoder.decode(buffer)
    return text
};
```

```

```

```
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbMjE2MTMwNjgwLDYxNTc1OTc0OCwtMjM3ND
AxOTM5XX0=
-->