import React from 'react'
import classnames from 'classnames'
import Icon, { IconType } from '../Icon'
import { transformUnit } from '../utils'
import './index.less'

export type ButtonType = 'primary' | 'optional' | 'selected' | 'border'

export type ButtonSize = 'normal' | 'large'

export type ButtonProps = Readonly<
  {
    icon?: IconType
    width?: number | string
    height?: number | string
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps> &
    React.HTMLAttributes<HTMLDivElement>
>

const defaultProps = {
  type: 'primary' as ButtonType,
  size: 'normal' as ButtonSize,
  disabled: false,
  circle: false,
}

const Button: React.FC<ButtonProps> = props => {
  const { type, size, circle, disabled, width, height, icon } = props

  const compClsPrefix = 'react-app-ui-button'
  const compClsName = classnames(
    compClsPrefix,
    props.className,
    `${compClsPrefix}__${type}`,
    `${compClsPrefix}__${size}`,
    {
      [`${compClsPrefix}__circle`]: circle,
      [`${compClsPrefix}__disabled`]: disabled,
    },
  )
  const compStyle = {
    ...props.style,
    width: transformUnit(width),
    height: transformUnit(height),
  }

  return (
    <div
      className={compClsName}
      style={compStyle}
      onClick={props.onClick}
      onTouchStart={props.onTouchStart}
    >
      {icon && <Icon className={compClsPrefix + '-icon'} type={icon}></Icon>}
      {props.children && (
        <span className={compClsPrefix + '-content'}>{props.children}</span>
      )}
    </div>
  )
}

Button.defaultProps = defaultProps

export default Button
