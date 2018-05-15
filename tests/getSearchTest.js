const scrape = require('../index.js');
const puppeteer = require('puppeteer');
const util = require('util');

(async () => {
    console.log(`Test 1: getSearch()`)
    let start = new Date();
    let browser = await puppeteer.launch();
    let page = await scrape.initPage(browser);
    let sources = await scrape.getSearch(page, 'dragon ball super', 1);
    console.log(util.inspect(sources, false, null));
    console.log(`Test 1: getSearch() - Execution Time: ${new Date() - start}`);
})();