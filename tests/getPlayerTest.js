const scrape = require('../index.js');
const puppeteer = require('puppeteer');
const util = require('util');

(async () => {
    console.log(`Test 1: getSearch()`)
    let start = new Date();
    let browser =  await puppeteer.launch({headless: false});
    let page = await scrape.initPage(browser);
    let player = await scrape.getPlayer(page, 'https://www5.9anime.is/watch/neon-genesis-evangelion-dub.yk0z/x6kxv3')
    console.log(player);

    console.log(`Test 1: getSearch() - Execution Time: ${new Date() - start}`);
})();