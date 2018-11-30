const puppeteer = require('puppeteer')
const { timeout, log } = require('../../utils/tools'); // 引入工具类.
// const elasticsearch = require('elasticsearch');

let scrape = async(city, page) => {
    // const browser = await puppeteer.launch({
    //     args: ['--no-sandbox'],
    //     dumpio: false,
    //     // headless: false
    // })
    // log(city.name + ' - 浏览器正常启动')
    // const page = await browser.newPage()
    for (let i = 1; i <= 5; i++) {
        await timeout(200);
        await page.goto(city.link + '/nv/' + i, {
            waitUntil: 'networkidle2'
        })
        log(city.name + ' - 页面加载完毕' + city.link + '/nv/' + i)
            // var esClient = new elasticsearch.Client({
            //     host: 'localhost:9200',
            //     log: 'error'
            // });

        const lists = await page.evaluate(() => {
            const userList = []
            let itemList = document.querySelectorAll('.g-list>.list-item')
            for (let item of itemList) {
                let html = item.querySelector('.content') ? item.querySelector('.content').innerHTML : ''
                let sexRe = /<td width="180"><span class="grayL">性别：<\/span>(.*?)<\/td>/g.exec(html)
                let addRe = /<td><span class="grayL">居住地：<\/span>(.*?)<\/td>/g.exec(html)
                let ageRe = /<td width="180"><span class="grayL">年龄：<\/span>(.*?)<\/td>/g.exec(html)
                let eduRe = /<td><span class="grayL">学&nbsp;&nbsp;&nbsp;历：<\/span>(.*?)<\/td>/g.exec(html)
                let maRe = /<td width="180"><span class="grayL">婚况：<\/span>(.*?)<\/td>/g.exec(html)
                let heightRe = /<td width="180"><span class="grayL">身&nbsp;&nbsp;&nbsp;高：<\/span>(.*?)<\/td>/g.exec(html)
                userList.push({
                    id: /http:\/\/album.zhenai.com\/u\/(\d+)/g.exec(item.querySelector('.photo>a').href)[1],
                    name: item.querySelector('.photo>a>img') ? item.querySelector('.photo>a>img').alt : '',
                    sex: sexRe ? sexRe[1] : '',
                    address: addRe ? addRe[1] : '',
                    age: ageRe ? +ageRe[1] : 0,
                    education: eduRe ? eduRe[1] : '',
                    marrige: maRe ? maRe[1] : '',
                    height: heightRe ? +heightRe[1] : 0,
                    photo: item.querySelector('.photo>a>img') ? item.querySelector('.photo>a>img').src : '',
                    detailLink: item.querySelector('.photo>a') ? item.querySelector('.photo>a').href : '',
                    introduce: item.querySelector('.introduce') ? item.querySelector('.introduce').innerText : '',
                })
            }
            return userList
        })
        console.log(lists, '结果')
            // for (let index = 0; index < lists.length; index++) {
            //     esClient.create({
            //         index: 'myindex',
            //         type: 'mytype',
            //         id: index,
            //         body: lists[index]
            //     }, function(error, response) {});
            // }
    }
    await page.close()
}

module.exports = scrape