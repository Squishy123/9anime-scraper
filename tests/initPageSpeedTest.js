const scrape = require('./index.js');
const puppeteer = require('puppeteer');

(async () => {
    await (async () => {
        console.log(`Test 1: initPage()`)
        let start = new Date();
        let browser = await puppeteer.launch();
        let page = await scrape.initPage(browser);
        console.log(`Rapidvideo: ${await scrape.getPlayer(page, 'https://www4.9anime.is/watch/katana-maidens-toji-no-miko-dub.m1zp/7y8jq7')}`)
        console.log(`Streamango: ${await scrape.getPlayer(page, 'https://www4.9anime.is/watch/katana-maidens-toji-no-miko-dub.m1zp/474q67')}`)
        console.log(`Openload: ${await scrape.getPlayer(page, 'https://www4.9anime.is/watch/katana-maidens-toji-no-miko-dub.m1zp/6y8lp7')}`)
        await page.close();
        await browser.close();
        console.log(`Test 1: initPage() - Execution Time: ${new Date() - start}`);
    })();

    await (async () => {
        console.log(`Test 2: browser.newPage()`)
        let start = new Date();
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        console.log(`Rapidvideo: ${await scrape.getPlayer(page, 'https://www4.9anime.is/watch/katana-maidens-toji-no-miko-dub.m1zp/7y8jq7')}`)
        console.log(`Streamango: ${await scrape.getPlayer(page, 'https://www4.9anime.is/watch/katana-maidens-toji-no-miko-dub.m1zp/474q67')}`)
        console.log(`Openload: ${await scrape.getPlayer(page, 'https://www4.9anime.is/watch/katana-maidens-toji-no-miko-dub.m1zp/6y8lp7')}`)
        await page.close();
        await browser.close();
        console.log(`Test 2: browser.newPage() - Execution Time: ${new Date() - start}`);
    })();
})();
