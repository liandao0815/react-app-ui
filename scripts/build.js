const path = require('path')
const rimraf = require('rimraf')
const ora = require('ora')
const chalk = require('chalk')
const { execSync } = require('child_process')

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
  )
}

clearConsole()
rimraf.sync(path.join(__dirname, '../lib'))
console.log(chalk.bold.green('成功删除 lib 目录\n'))

/** 打包各个组件 */
const spinner1 = ora(`Loading ${chalk.bold.blue('打包各个组件……')}`).start()
execSync(`npx rollup -c`)
clearConsole()
spinner1.succeed(chalk.bold.green('成功打包各个组件'))

/** 生成声明文件 */
const spinner2 = ora(`Loading ${chalk.bold.blue('生成声明文件……')}`).start()
execSync(`npx tsc`)
spinner2.succeed(chalk.bold.green('成功生成声明文件'))

console.log(chalk.bold.green('done !'))
