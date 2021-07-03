const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')

class Generate {
  constructor() {
    this.component = process.argv[2]

    if (!this.component) {
      const msg = chalk.bold.red(
        '组件名称缺失，请使用以下命令创建：\nyarn new ComponentName / npm run new ComponentName',
      )
      console.log(msg)
      process.exit(1)
    }

    if (fs.existsSync(path.resolve('packages', this.component))) {
      console.log(chalk.bold.red(`${this.component} 组件已经存在`))
      process.exit(1)
    }

    this.dashName = this.component.replace(/\B([A-Z])/g, '-$1').toLowerCase()

    this.generateComponentDir()
    this.generateIndexTsx()
    this.generateIndexLess()
    this.generateStory()
    this.generateTest()
    this.updateInputFile()

    execSync(
      `npx prettier --write packages/index.tsx packages/${this.component}`,
    )

    console.log(
      chalk.bold.green(`组件成功添加到 packages/${this.component} 目录下`),
    )
  }

  generateComponentDir() {
    fs.mkdirSync(path.resolve('packages', this.component))
  }

  generateIndexTsx() {
    const content = `
      import React from 'react'
      import classnames from 'classnames'
      import './index.less'
      
      export type ${this.component}Props = Readonly<{
        className?: string
        style?: React.CSSProperties
      }>
      
      const ${this.component}: React.FC<${this.component}Props> = props => {
        const compClsPrefix = 'react-app-ui-${this.dashName}'
        const compClsName = classnames(compClsPrefix, props.className)
      
        return <div className={compClsName}>${this.component}</div>
      }
      
      ${this.component}.defaultProps = {}
      
      export default ${this.component}
    `
    this.writeFile('index.tsx', content)
  }

  generateIndexLess() {
    const content = `
      @import '../styles/index.less';

      @${this.dashName}-prefix-cls: ~"@{css-prefix}-${this.dashName}";

      .@{${this.dashName}-prefix-cls} {}
    `
    this.writeFile('index.less', content)
  }

  generateStory() {
    const path = `${this.component}/__story__`
    const content = `
      import React from 'react'
      import ${this.component} from '../index'
      
      export default {
        title: '${this.component}',
      }
    `
    this.mkdir('__story__')
    this.writeFile('index.story.tsx', content, path)
  }

  generateTest() {
    const path = `${this.component}/__test__`
    const content = `
      import React from 'react'
      import { render } from '@testing-library/react'
      import ${this.component} from '../index'

      describe(${this.component}, () => {
        beforeEach(() => {})
      })
    `
    this.mkdir('__test__')
    this.writeFile('index.spec.tsx', content, path)
  }

  updateInputFile() {
    const dir = path.resolve(`packages/index.tsx`)
    const oldContent = fs.readFileSync(dir, { encoding: 'utf8' })
    const newContent = `
      ${oldContent.substring(0, oldContent.length - 1)}
      export { default as ${this.component} } from './${this.component}'
    `
    fs.writeFileSync(dir, newContent, { encoding: 'utf8' })
  }

  writeFile(fileName, content = '', dir = this.component) {
    fs.writeFileSync(path.resolve(`packages/${dir}`, fileName), content, {
      encoding: 'utf8',
    })
  }

  mkdir(dirName) {
    fs.mkdirSync(path.resolve(`packages/${this.component}`, dirName))
  }
}

new Generate()
