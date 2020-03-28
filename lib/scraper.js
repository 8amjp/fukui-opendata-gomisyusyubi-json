const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url = require('url');

module.exports.scrape = async (page) => {
    const response = await fetch(page)
    const body = await response.text()
    const $ = await cheerio.load(body)
    const relativePaths = await $('a[href$=".csv"]').map((i, el) => $(el).attr('href')).get()
    const absolutePaths = await relativePaths.map(path => url.resolve(page, path))
    return absolutePaths
}
