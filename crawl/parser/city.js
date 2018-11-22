const puppeteer = require('puppeteer')
const { timeout, log } = require('../utils/tools'); // 引入工具类.
const UserParser = require('./user');

class CityParser {
    static Run() {
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                dumpio: false
            })
            log('服务正常启动')
            try {
                const page = await browser.newPage()

                await page.goto('http://www.zhenai.com/zhenghun')
                log('页面初次加载完毕')


                const handleData = async() => {
                    const list = await page.evaluate(() => {

                            const cityList = []

                            let itemList = document.querySelectorAll('.city-list dd a')

                            for (let item of itemList) {
                                let cityData = {
                                    city: undefined,
                                    link: undefined,
                                }
                                cityData.link = item.href

                                cityData.city = item.innerText

                                cityList.push(cityData)
                            }
                            return cityList

                        })
                        // const result = await mongo.insertMany('GTX1080', list)

                    return list
                }

                const result = await handleData()
                console.log(result, '结果')
                UserParser.Run(result)
                await browser.close()
                log('服务正常结束')
            } catch (error) {
                console.log(error)
                log('服务意外终止')
                await browser.close()
            }
        })()
    }
}

module.exports = CityParser