# fukui-opendata-gomisyusyubi-json

[福井県オープンデータ](https://www.pref.fukui.lg.jp/gyosei/jouhoukoukai/opendata/index.html)の「[ごみ収集日一覧](https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html)」で公開されている収集日のCSV（Shift-JIS）をJSONに変換します。

## Description

樹里「というわけで、福井県内自治体の[ごみ収集日一覧](https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html)JSONデータを作成するアプリを作ってみた」
絵子「ほう。なんでまた突然」
樹里「それがな、久しぶりに[福井県オープンデータ](https://www.pref.fukui.lg.jp/gyosei/jouhoukoukai/opendata/index.html)に公開されてるデータを使って、Webアプリでも作ってみようとしたんだがな」
絵子「ふむふむ」
樹里「で、ごみ収集日一覧の収集日のデータを見てみたわけなんだが、公開されてるデータがなんとShift-JISのCSVなんだよ。この令和のご時世に」
絵子「うーん。確かにそのままだと扱いにくいよね」
樹里「**Shift-JISのCSVなんだよ。この令和のご時世に**」
絵子「2回言わなくていいよ。あと太字にしなくてもいいよ」
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



### lib/scraper.js

樹里「

```js:lib/scraper.js
/*
  指定されたページ内の、CSVへのリンクをを取得します。
*/
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url = require('url');

module.exports.scrape = async (page) => {
    // 指定されたページのHTMLを取得する
    const response = await fetch(page)
    const body = await response.text()
    // cheerioでページをスクレイピング
    const $ = await cheerio.load(body)
    // 末尾が'.csv'のリンクをすべて取得
    const relativePaths = await $('a[href$=".csv"]').map((i, el) => $(el).attr('href')).get()
    // 絶対パスに変換
    const absolutePaths = await relativePaths.map(path => url.resolve(page, path))
    return absolutePaths
}
```

### lib/generator.js

樹里「

```js:lib/generator.js
/*
  指定されたURLのCSVを取得し、文字コードをShift-JISからUTF-8にに変換して出力します。
*/
const path = require('path')
const fs = require('fs-extra')
const parse = require('csv-parse/lib/sync')
const fetcher = require('./fetcher')

module.exports.generate = async (resource) => {
    // ファイル名を生成
    const file = path.basename(resource, '.csv') + '.json'
    // 指定されたURLのCSVを取得
    const csv = await fetcher.fetch(resource)
    // CSVをJSONに変換
    const json = await parse(csv, { columns: true, trim: true })
    // JSONを出力
    const result = await fs.outputJson(path.join('dist', file), json, { spaces: 4 })
    return result
};
```

### lib/fetcher.js

樹里「最後に、CSVを取得する`fetcher`モジュールだ」

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

樹里「単に、[node-fetch](https://www.npmjs.com/package/node-fetch)でCSVを取得してShift-JISに変換しているだけだ」  
絵子「へー、[TextDecoder](https://developer.mozilla.org/ja/docs/Web/API/TextDecoder)っていうので文字コードを変換できるんだね」  

樹里「……という感じで、
絵子「

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## Author

[8amjp](https://github.com/8amjp)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE5NTY1NzYsODExNDAxOTYsNjE1NzU5Nz
Q4LC0yMzc0MDE5MzldfQ==
-->