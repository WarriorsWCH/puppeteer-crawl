const puppeteer = require('puppeteer')
const { log } = require('../../utils/tools'); // 引入工具类.
const scrape = require('./user');

class CityParser {
    static Run() {
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                dumpio: false,
                headless: false
            })
            log('浏览器正常启动')
            try {
                const page = await browser.newPage()

                await page.goto('http://www.zhenai.com/zhenghun', {
                    waitUntil: 'networkidle2'
                })
                log('珍爱网城市页面加载完毕')

                const list = await page.evaluate(() => {

                    const cityList = []

                    let itemList = document.querySelectorAll('.city-list dd a')

                    for (let item of itemList) {
                        cityList.push({
                            name: item.innerText,
                            link: item.href,
                        })
                    }
                    return cityList

                })
                log('当前页爬取数据的所有数据')
                console.log(list)
                for (let index = 0; index < 10; index++) {
                    const page = await browser.newPage()
                    scrape(list[index], page)
                }
                await page.close()
                    // await browser.close()
            } catch (error) {
                console.log(error)
                log('服务意外终止')
                await browser.close()
            }
        })()
    }
}

module.exports = CityParser