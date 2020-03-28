const scraper = require('./lib/scraper');
const generator = require('./lib/generator');

(async () => {
    const page = 'https://www.pref.fukui.lg.jp/doc/toukei-jouhou/opendata/list_ct_gomisyusyubi.html'
    const resources = await scraper.scrape(page)
    await Promise.all(resources.map(resource => generator.generate(resource)));
    console.log('exit.')
})();
