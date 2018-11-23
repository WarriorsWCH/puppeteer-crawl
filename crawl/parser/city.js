const puppeteer = require('puppeteer')
const { timeout, log } = require('../utils/tools'); // 引入工具类.
const scrape = require('./user');

class CityParser {
    static Run() {
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                dumpio: false
            })
            log('浏览器正常启动')
            try {
                const page = await browser.newPage()

                await page.goto('http://www.zhenai.com/zhenghun', {
                    waitUntil: 'networkidle2'
                })
                log('珍爱网城市页面加载完毕')


                const handleData = async() => {
                    const list = await page.evaluate(() => {

                        const cityList = []

                        let itemList = document.querySelectorAll('.city-list dd a')

                        for (let item of itemList) {
                            let cityData = {
                                name: undefined,
                                link: undefined,
                            }
                            cityData.link = item.href

                            cityData.name = item.innerText

                            cityList.push(cityData)
                        }
                        return cityList

                    })
                    return list
                }

                const result = await handleData()
                console.log(result, '结果')
                for (let index = 0; index < 2; index++) {
                    scrape(result[index])
                }
                await browser.close()
                log('珍爱网城市页面浏览器关闭')
            } catch (error) {
                console.log(error)
                log('服务意外终止')
                await browser.close()
            }
        })()
    }
}

module.exports = CityParser