const scrape = require('./index.js');
const puppeteer = require('puppeteer');
const util = require('util');

(async () => {
    console.log(`Test 1: getSource()`)
    let start = new Date();
    let browser = await puppeteer.launch();
    let page = await scrape.initPage(browser);
    let sources = await scrape.getSource(page, 'https://www4.9anime.is/watch/one-piece.ov8/83ox3q');
    console.log(util.inspect(sources, false, null));
    console.log(`Test 1: getSource() - Execution Time: ${new Date() - start}`);
})();