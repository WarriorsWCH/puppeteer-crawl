const puppeteer = require('puppeteer');
var { timeout } = require('../../utils/tools');

puppeteer.launch({ headless: false }).then(async browser => {
    let page = await browser.newPage();

    await page.goto('https://www.colabug.com/', {
        waitUntil: 'networkidle2'
    });
    // await timeout(2000);
    // 获取总页数
    // 此方法在页面内执行 document.querySelector，然后把匹配到的元素作为第一个参数传给 pageFunction。
    const total = await page.$eval('.page-numbers:last-child', el => +el.innerText.split('/')[1].trim());
    console.log(total)
    let data = []
    let count = 1
    while (total >= count) {
        // 此方法在页面内执行 Array.from(document.querySelectorAll(selector))，然后把匹配到的元素数组作为第一个参数传给 pageFunction。
        const imgs = await page.$$eval('.post-card-thumbnail>img', el => {
            return Array.from(el, function(item) {
                return item.src;
            })
        });
        const cats = await page.$$eval('.cat-links>a', el => {
            return Array.from(el, function(item) {
                return item.innerText;
            })
        });
        const posteds = await page.$$eval('.posted-on', el => {
            return Array.from(el, function(item) {
                return item.innerText;
            })
        });
        const titles = await page.$$eval('.post-card-title>a', el => {
            return Array.from(el, function(item) {
                return item.innerText;
            })
        });
        const urls = await page.$$eval('.post-card-title>a', el => {
            return Array.from(el, function(item) {
                return item.href;
            })
        });

        const contents = await page.evaluate(() => {
            let els = document.querySelectorAll('.post-card-caption')
            const arr = []
            for (let item of els) {
                if (item.querySelector('.post-card-content')) {
                    arr.push(item.querySelector('.post-card-content').innerText)
                } else {
                    arr.push('')
                }
            }
            return arr;
        })

        for (let i = 0; i < imgs.length; i++) {
            data.push({
                img: imgs[i],
                cat: cats[i],
                posted: posteds[i],
                title: titles[i],
                url: urls[i],
                content: contents[i]
            })
        }

        await timeout(500);
        await page.waitForSelector('#primary > #main > .navigation > .nav-links > .page-numbers:nth-last-child(2)')
        await page.click('#primary > #main > .navigation > .nav-links > .page-numbers:nth-last-child(2)')

        count++
        console.log(count)
    }
    console.log(data.length)
    browser.close();
});