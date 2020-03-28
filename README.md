# 福井県オープンデータ ごみ収集日一覧CSVをJSONに変換するツール

「[福井県オープンデータライブラリ](https://www.pref.fukui.lg.jp/gyosei/jouhoukoukai/opendata/index.html)」で公開されている、県内17市町の「[ごみ収集日一覧](https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html)」データの形式を、CSV（Shift-JIS）からJSONに変換します。

## Description

樹里「というわけで、福井県内自治体の[ごみ収集日一覧](https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html)JSONデータを作成するアプリを作ってみた」  
絵子「ほう。なんでまた突然」  
樹里「それがな、久しぶりに[福井県オープンデータ](https://www.pref.fukui.lg.jp/gyosei/jouhoukoukai/opendata/index.html)に公開されてるデータを使って、アプリでも作ってみようとしたんだがな」  
絵子「福井県は昔からオープンデータの公開に熱心だよね」  
樹里「で、ごみ収集日一覧のデータを見てみたんだが、なんとShift-JISのCSVなんだよ。この令和の時代に」  
絵子「うーん。確かにそのままだと扱いにくいよね」  
樹里「**Shift-JISのCSVなんだよ。この令和の時代に**」  
絵子「2回言わなくていいよ。あと太字にしなくてもいいよ」  
樹里「これではどうしようもないので、まずはちゃんとしたUTF-8のJSONに変換するアプリから作ってみたわけだ」  
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

樹里「まずは、メインとなるコードだ」

```js:index.js
/*
  「福井県オープンデータライブラリ」の「ごみ収集日一覧」ページで公開されている
  収集日のCSVデータ（Shift-JIS）をJSONに変換します。
*/

const scraper = require('./lib/scraper');
const generator = require('./lib/generator');
const page = 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html'; // 「ごみ収集日一覧」ページのURL

(async () => {
    // ページ内の17市町のCSVデータのURLを取得
    const resources = await scraper.scrape(page)
    // すべてのCSVを取得してJSONに変換して出力
    await Promise.all(resources.map(resource => generator.generate(resource)))
    console.log('できたよ！')
})();
```

絵子「`scraper`と`generator`っていうのが、樹里が作ったモジュール？」  
樹里「そう。`scraper`で「ごみ収集日一覧」ページからCSVへのリンクを取得している。で、`generator`でCSVを取得してJSONに変換している」  
絵子「なるほど」  
樹里「では、各モジュールの動きをみてみよう」

### lib/scraper.js

樹里「次に、ページをスクレイピングして、CSVへのリンクを取得する`scraper`モジュールだ」

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

樹里「スクレイピングには[cheerio](https://www.npmjs.com/package/cheerio)というライブラリを使用している」  
絵子「知ってる。jQueryっぽく操作できるやつだよね」  
樹里「そう。そのcheerioで、属性セレクターを使って、`href`属性 が ".csv" で終わる`a`要素、すなわちCSVへのリンクを取得してだな、その配列を返している」  
絵子「なるほど」

### lib/generator.js

樹里「最後に、データの変換を行う`generator`モジュールだ」

```js:lib/generator.js
/*
  指定されたURLのCSVを取得し、文字コードをShift-JISからUTF-8にに変換して出力します。
*/
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const parse = require('csv-parse/lib/sync');

module.exports.generate = async (resource) => {
    // ファイル名を生成
    const file = path.basename(resource, '.csv') + '.json'
    // 指定されたURLのCSVを取得
    const response = await fetch(resource)
    const buffer = await response.arrayBuffer()
    // CSVの文字コードをShift-JISからUTF-8にに変換
    const decoder = new TextDecoder("Shift_JIS")
    const csv = decoder.decode(buffer)
    // CSVをJSONに変換
    const json = await parse(csv, { columns: true, trim: true })
    // JSONを出力
    const result = await fs.outputJson(path.join('dist', file), json, { spaces: 4 })
    return result
};
```

樹里「まず、[node-fetch](https://www.npmjs.com/package/node-fetch)でCSVを取得して、Shift-JISからUTF-8に変換する」    
絵子「へー、[TextDecoder](https://developer.mozilla.org/ja/docs/Web/API/TextDecoder)っていうので文字コードを変換できるんだね」  
樹里「で、[csv](https://www.npmjs.com/package/csv)というライブラリの[`csv-parse`](https://csv.js.org/parse/)という機能を使って、CSVをJSONに変換しているわけだ」  
絵子「便利なライブラリだねー」

樹里「さて、処理の結果、このようなJSONが出力される」

```json
[
    {
        "行": "あ",
        "音": "あ",
        "町名": "在田町",
        "読み": "あいだ",
        "燃える": "火･金",
        "燃えない": "2･4木",
        "プラスチック製容器包装": "月",
        "カン": "1･3水",
        "ビン": "4水",
        "ペットボトル": "2水",
        "ダンボール": "3水",
        "蛍光灯": "4木",
        "キーワード": "清水",
        "備考": "清水南"
    },
    // 以下略
```

絵子「これ、キーが日本語になってるけど問題ないの？」  
樹里「ああ、仕様に則った正しいJSONだぞ」  
絵子「へー、そうなんだ」  
樹里「なにより、Shift-JISのCSVよりははるかに扱いやすい」  
絵子「よっぽどキライなんだね」

----

樹里「……さて、無事にShift-JISのCSVをJSONに変換できた」  
絵子「めでたしめでたし、だね」  
樹里「いやいや、データの形式を変換しただけで、何も出来上がってないぞ。大事なのは、このデータを使ってどんなアプリを作るかだ」  
絵子「そりゃそうだ。さ、次はアプリ制作に挑戦だ！」

## Author

[8amjp](https://github.com/8amjp)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTc0ODMzMzYzNywtMTQyMDMxNDU2MywxND
IxMjYwMjUxLC0xMjc5OTkwMTY1LC0yMzA2NTYxNjUsNDY4Njgz
MzA3LDgxMTQwMTk2LDYxNTc1OTc0OCwtMjM3NDAxOTM5XX0=
-->
