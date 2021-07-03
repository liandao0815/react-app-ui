import React from 'react'
import classnames from 'classnames'
import './index.less'
import { noop } from '../utils'

export type CardProps = Readonly<
  {
    tag?: string
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

const defaultProps = {
  disabled: false,
  onClick: noop,
}

const Card: React.FC<CardProps> = props => {
  const { tag, disabled, className, style } = props

  const compClsPrefix = 'react-app-ui-card'
  const compClsName = classnames(compClsPrefix, className)
  const tagClsName = classnames(compClsPrefix + '__tag', {
    [`${compClsPrefix}__tag--disabled`]: disabled,
  })

  const onClick = () => {
    !disabled && props.onClick()
  }

  return (
    <div className={compClsName} style={style} onClick={onClick}>
      {tag && <span className={tagClsName}>{tag}</span>}
      {props.children}
    </div>
  )
}

Card.defaultProps = defaultProps

export default Card
