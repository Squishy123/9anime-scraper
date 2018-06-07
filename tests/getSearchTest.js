const scrape = require('../index.js');
const puppeteer = require('puppeteer');
const util = require('util');

(async () => {
    console.log(`Test 1: getSearch()`)
    let start = new Date();
    let search = await scrape.getSearch('dragon ball super', null, (res) => {
        console.log(util.inspect(res, false, null));
        console.log(`Test 1: getSearch() - Execution Time: ${new Date() - start}`);
    });
})();