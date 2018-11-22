const chalk = require('chalk');
const fs = require('fs');

class Tools {
    /**
     * 延迟执行
     * @param {int} delay 毫秒数
     */
    static timeout(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(1)
                } catch (e) {
                    reject(0)
                }
            }, delay);
        })
    }

    /**
     *
     * 打印日志. 默认打印信息.
     *
     * @param {string} content 描述信息
     * @param {enum} type title|warning|error|info
     * @example
     * ```javascript
     *  log('hello world', 'title');
     *  log('这里是个警告.', 'warning');
     *  log('这里是个错误.', 'error');
     *  log('这里是个描述.', 'info');
     *  log('这里也是描述.');
     * ```
     */
    static log(content, type) {
        let updatedContent = '';
        let logPath = process.env.logPath;
        switch (type) {
            case 'title':
                updatedContent = '标题:' + content;
                console.log(chalk.green(`${chalk.bold(updatedContent)}`));
                break;

            case 'warning':
                updatedContent = '警告:' + content;
                console.log(chalk.red(`\t${chalk.bold(updatedContent)}\t`));
                break;

            case 'error':
                updatedContent = '错误:' + content;
                console.log(chalk.black(`\t${chalk.bgRed.bold(updatedContent)}\t`));
                break;

            case 'info':
                updatedContent = '描述:' + content;
                console.log(chalk.cyan(`\t${chalk.bold(updatedContent)}\t`));
                break;
            default:
                updatedContent = '描述:' + content;
                console.log(chalk.cyan(`\t${chalk.bold(updatedContent)}\t`));
                break;
        }
    }
}
module.exports = Tools;