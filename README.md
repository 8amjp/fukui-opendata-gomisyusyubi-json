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

樹里「上記のコマンドを実行すれば、`dist`ディレクトリにJSONデータが出力される」
絵子「あら本当に簡単」
樹里「じゃあ、アプリがどういう動きをするのか解説しよう」

```js;
const scraper = require('./lib/scraper');
const generator = require('./lib/generator');

(async () => {
    const page = 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html'
    const resources = await scraper.scrape(page)
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

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE4NDY0MTIyMV19
-->