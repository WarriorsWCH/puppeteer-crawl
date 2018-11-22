const puppeteer = require('puppeteer')
const { timeout, log } = require('../utils/tools'); // 引入工具类.

class UserParser {

    static Run(list) {
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                dumpio: false
            })
            log('服务正常启动')
            for (let index = 0; index < list.length; index++) {
                const page = await browser.newPage()
                await page.goto(list[index].link)
                log(list[index].city + '页面初次加载完毕')
                timeout(500)
                    // 使用一个 for await 循环，不能一个时间打开多个网络请求，这样容易因为内存过大而挂掉
                for (let i = 1; i <= 5; i++) {
                    // 找到分页的输入框以及跳转按钮
                    const next = await page.$$(`.paging-item`)
                    console.log(next[0], '介绍')
                        // 模拟点击跳转
                        // await next.click()
                        // 等待页面加载完毕，这里设置的是固定的时间间隔，之前使用过page.waitForNavigation()，但是因为等待的时间过久导致报错（Puppeteer默认的请求超时是30s,可以修改）,因为这个页面总有一些不需要的资源要加载，而我的网络最近日了狗，会导致超时，因此我设定等待2.5s就够了
                    await page.waitFor(2500)

                    // 处理数据，这个函数的实现在下面
                    await handleData()
                        // 一个页面爬取完毕以后稍微歇歇，不然太快淘宝会把你当成机器人弹出验证码（虽然我们本来就是机器人）
                    await page.waitFor(2500)
                }

                console.log(result, '结果')
            }

            const handleData = async() => {
                const list = await page.evaluate(() => {

                        const userList = []

                        let itemList = document.querySelectorAll('.list-item')

                        for (let item of itemList) {
                            let cityData = {
                                introduce: undefined,
                            }
                            cityData.introduce = item.querySelector('.introduce').innerText

                            console.log(cityData.introduce, '介绍')

                        }
                        return cityList

                    })
                    // const result = await mongo.insertMany('GTX1080', list)

                return list
            }
        })()
    }
}

module.exports = UserParser