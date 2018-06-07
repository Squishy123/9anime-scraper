const scrape = require('../index.js');
const puppeteer = require('puppeteer');
const util = require('util');

(async () => {
    console.log(`Test 1: getSource()`)
    let start = new Date();
    let sources = await scrape.getSource('https://www5.9anime.is/watch/neon-genesis-evangelion-dub.yk0z/r92rwn', null, (sources) => {
        console.log(util.inspect(sources, false, null));
        console.log(`Test 1: getSource() - Execution Time: ${new Date() - start}`);
    });
})();