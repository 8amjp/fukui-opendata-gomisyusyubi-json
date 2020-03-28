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
