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
