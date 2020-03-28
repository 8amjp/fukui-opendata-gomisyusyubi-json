const fetch = require('node-fetch');

module.exports.fetch = async (url) => {
    const response = await fetch(url)
	const buffer = await response.arrayBuffer()
    const decoder = new TextDecoder("Shift_JIS")
    const text = decoder.decode(buffer)
    return text;
};