const puppeteer = require('puppeteer');

//Properties
const blacklist = require('./properties.js').blacklist;

module.exports = {

    /*
    * Creates a new puppeteer page with network intercept
    */
    initPage: async function (browser) {
        let page = await browser.newPage();
        //Block all popups
        await page.evaluateOnNewDocument(() => {
            window.open = () => null;
        });
        //Block cluttered resources
        await page.setRequestInterception(true);
        let intercept = (interceptedRequest) => {
            let url = interceptedRequest.url().toString();
            let bl = blacklist.some((e) => {
                return url.includes(e);
            })
            if (!bl) {
                interceptedRequest.continue();
            } else interceptedRequest.abort();
        }
        page.on('request', intercept);
        return page;
    },
    /*
    * Get the player source of a given 9anime episode url
    */
    getPlayer: async function (page, url) {

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.click('#player')
        try {
            await page.waitForSelector('#player > iframe');
        } catch (err) { }
        return await page.evaluate(() => {
            return document.querySelector('#player > iframe').src;
        });
    },
    /**
    * Grabs the links of all episodes on the given source page
    * @param {String} url 
    */
    getSource: async function (page, url) {
        try {
            await page.goto(url, { waitUntil: "domcontentloaded" });
        } catch (err) { }
        let sources = await page.evaluate(() => {
            let sources = [];
            for (let p = 1; p <= document.querySelector('#main > div > div.widget.servers > div.widget-body').children.length; p++) {
                let id = document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p})`).getAttribute('data-id');
                sources.push({ id: id, sourceList: [] });
                //range
                let range = (document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > div`)) ? document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > div`).children.length : 1;
                for (let r = 0; r < range; r++) {
                    if (range == 1) {
                        let list = [];
                        let listLength = [...document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul`).children].length;
                        for (let i = 1; i <= listLength; i++) {
                            list.push({ href: document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).href, index: i });
                        }
                        sources[p - 1].sourceList = list;
                    } else {
                        let list = [];
                        let listLength = [...document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul:nth-child(${r + 2})`).children].length;
                        for (let i = 1; i <= listLength; i++) {
                            list.push({ href: document.querySelector(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul:nth-child(${r + 2}) > li:nth-child(${i}) > a`).href, index: i });
                        }
                        sources[p - 1].sourceList.push(...list);
                    }
                }
            }
            return sources;
        });
        return sources;
    },
    /**
     * Returns the links of animes under a keyword search 
     */
    getSearch: async function (page, keyword, pages) {
        let results = [];
        await page.goto(`https://www4.9anime.is/search?keyword=${keyword}`, { waitUntil: 'domcontentloaded' });
        try {
            await page.waitForSelector('#main > div > div:nth-child(1) > div.widget-body');
        } catch (err) {
        }
        let total = await page.evaluate((pages) => {
            return (document.querySelector('#main > div > div:nth-child(1) > div.widget-body > div.paging-wrapper > form > span.total')) ? ((document.querySelector('#main > div > div:nth-child(1) > div.widget-body > div.paging-wrapper > form > span.total').textContent > pages) ? pages : document.querySelector('#main > div > div:nth-child(1) > div.widget-body > div.paging-wrapper > form > span.total').textContent) : 1;
        }, pages)
        for (let i = 1; i <= total; i++) {
            await page.goto(`https://www4.9anime.is/search?keyword=${keyword}&page=${i}`, { waitUntil: 'domcontentloaded' });
            results.push([]);
            let items = await page.evaluate(() => {
                let items = [];
                for (let c = 1; c < document.querySelector('#main > div > div:nth-child(1) > div.widget-body > div.film-list').children.length; c++) {
                    items.push({ poster: document.querySelector(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c})`).children[0].children[0].children[0].src, href: document.querySelector(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c})`).children[0].children[1].href, title: document.querySelector(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c})`).children[0].children[1].textContent });
                }
                return items;
            });
            results[i - 1].push(...items);
        }
        return results;
    }
}

