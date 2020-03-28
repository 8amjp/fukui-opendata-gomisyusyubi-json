const path = require('path')
const fs = require('fs-extra')
const parse = require('csv-parse/lib/sync')
const fetcher = require('./fetcher')

module.exports.generate = async (resource) => {
    const file = path.basename(resource, '.csv') + '.json'
    const csv = await fetcher.fetch(resource)
    const json = await parse(csv, { columns: true, trim: true });
    const result = await fs.outputJson(path.join('dist', file), json, { spaces: 4 })
    return result
};