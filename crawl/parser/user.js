const puppeteer = require('puppeteer')
const { timeout, log } = require('../utils/tools'); // 引入工具类.
const elasticsearch = require('elasticsearch');

let scrape = async(city) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })
    log(city.name + ' - 浏览器正常启动')
    for (let i = 1; i <= 5; i++) {
        const page = await browser.newPage()
        await page.goto(city.link + '/nv/' + i, {
            waitUntil: 'networkidle2'
        })
        log(city.name + ' - 页面加载完毕')
        var esClient = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'error'
        });

        const lists = await page.evaluate(() => {
            const userList = []
            let itemList = document.querySelectorAll('.introduce')
            for (let item of itemList) {
                userList.push({
                    item: item.innerText
                })
            }
            return userList
        })
        console.log(lists, '结果')
        for (let index = 0; index < lists.length; index++) {
            esClient.create({
                index: 'myindex',
                type: 'mytype',
                id: index,
                body: lists[index]
            }, function(error, response) {});
        }
    }
    await browser.close()
}

module.exports = scrape