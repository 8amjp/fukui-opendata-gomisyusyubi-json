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
