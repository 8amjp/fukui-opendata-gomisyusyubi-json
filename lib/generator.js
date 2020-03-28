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
