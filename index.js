const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const request = require('request');

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
    getSource: function (url, options, cb) {
        if (options) {
            request.defaults(options)(url, (err, res, body) => {
                if (!err) {
                    const $ = cheerio.load(body);
                    let sources = [];
                    for (let p = 1; p <= $('#main > div > div.widget.servers > div.widget-body').children().length; p++) {
                        let id = $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p})`).attr('data-id');
                        sources.push({ id: id, sourceList: [] });
                        //range
                        let range = ($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > div`).length) ? $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > div`).children().length : 1;
                        for (let r = 0; r < range; r++) {
                            if (range == 1) {
                                let list = [];
                                let listLength = $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul`).children().length;
                                for (let i = 1; i <= listLength; i++) {
                                    if (!isNaN(Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))))
                                        list.push({ href: $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('href'), index: Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))});
                                }
                                sources[p - 1].sourceList = list;
                            } else {
                                let list = [];
                                let listLength = $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul:nth-child(${r + 2})`).children().length;
                                for (let i = 1; i <= listLength; i++) {
                                    if (!isNaN(Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))))
                                        list.push({ href: $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul:nth-child(${r + 2}) > li:nth-child(${i}) > a`).attr('href'), index: Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))});
                                }
                                sources[p - 1].sourceList.push(...list);
                            }
                        }
                    }
                    cb(sources);
                } else {
                    cb(err)
                }
            });
        } else {
            request(url, (err, res, body) => {
                if (!err) {
                    const $ = cheerio.load(body);
                    let sources = [];
                    for (let p = 1; p <= $('#main > div > div.widget.servers > div.widget-body').children().length; p++) {
                        let id = $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p})`).attr('data-id');
                        sources.push({ id: id, sourceList: [] });
                        //range
                        let range = ($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > div`).length) ? $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > div`).children().length : 1;
                        for (let r = 0; r < range; r++) {
                            if (range == 1) {
                                let list = [];
                                let listLength = $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul`).children().length;
                                for (let i = 1; i <= listLength; i++) {
                                    if (!isNaN(Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))))
                                        list.push({ href: $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('href'), index: Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))});
                                }
                                sources[p - 1].sourceList = list;
                            } else {
                                let list = [];
                                let listLength = $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul:nth-child(${r + 2})`).children().length;
                                for (let i = 1; i <= listLength; i++) {
                                    if (!isNaN(Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))))
                                        list.push({ href: $(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul:nth-child(${r + 2}) > li:nth-child(${i}) > a`).attr('href'), index: Number($(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${p}) > ul > li:nth-child(${i}) > a`).attr('data-comment'))});
                                }
                                sources[p - 1].sourceList.push(...list);
                            }
                        }
                    }
                    cb(sources);
                } else {
                    cb(err)
                }
            });
        }
    },
    /**
     * Returns the links of animes under a keyword search 
     */
    getSearch: async function (keyword, options, cb) {
        if (options) {
            request.defaults(options)(`https://www4.9anime.is/search?keyword=${keyword}`, (err, res, body) => {
                if (!err) {
                    const $ = cheerio.load(body);
                    let results = [];
                    let length = $('#main > div > div:nth-child(1) > div.widget-body > div.film-list').children().length;
                    for (let c = 1; c <= length; c++) {
                        if ($(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('href') && $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('data-jtitle'))
                            results.push({
                                poster: $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div`).find(`a.poster > img`).attr('src'),
                                href: $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('href'),
                                title: $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('data-jtitle')
                            });
                    }
                    cb(results);
                } else {
                    cb(err)
                }
            });
        } else {
            request(`https://www4.9anime.is/search?keyword=${keyword}`, (err, res, body) => {
                if (!err) {
                    const $ = cheerio.load(body);
                    let results = [];
                    let length = $('#main > div > div:nth-child(1) > div.widget-body > div.film-list').children().length;
                    for (let c = 1; c <= length; c++) {
                        if ($(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('href') && $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('data-jtitle'))
                            results.push({
                                poster: $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div`).find(`a.poster > img`).attr('src'),
                                href: $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('href'),
                                title: $(`#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${c}) > div > a.name`).attr('data-jtitle')
                            });
                    }
                    cb(results);
                } else {
                    cb(err)
                }
            });
        }
    }
}

