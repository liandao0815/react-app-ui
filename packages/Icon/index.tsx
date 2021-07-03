import React from 'react'
import classnames from 'classnames'
import * as IconSvg from './IconSvg'
import './index.less'

export type IconType = keyof typeof IconSvg

export type IconProps = Readonly<{
  type: IconType
  className?: string
  style?: React.CSSProperties
}>

const Icon: React.FC<IconProps> = props => {
  const { type, className, style } = props

  const compClsPrefix = 'react-app-ui-icon'
  const compClsName = classnames(
    compClsPrefix,
    className,
    `${compClsPrefix}--${type}`,
  )

  const svgHtml = IconSvg[type]

  return (
    <i
      className={compClsName}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    ></i>
  )
}

export default Icon
