const scrape = require('../index.js');
const puppeteer = require('puppeteer');
const util = require('util');

(async () => {
    console.log(`Test 1: getSource()`)
    let start = new Date();
    let sources = await new Promise((resolve, reject) => {
        scrape.getSource('https://www6.9anime.is/watch/darling-in-the-franxx.rv5n', null, (sources) => {
            resolve(sources);
        });
    });
    console.log(util.inspect(sources, false, null));
    console.log(`Test 1: getSource() - Execution Time: ${new Date() - start}`);
})();