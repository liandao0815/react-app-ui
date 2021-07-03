import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import Icon from '../Icon'
import { noop } from '../utils'
import './index.less'

export type CheckboxProps = Readonly<
  {
    checked?: boolean
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

const defaultProps = {
  disabled: false,
  defaultChecked: false,
  onChange: noop as (checked: boolean) => void,
}

const Checkbox: React.FC<CheckboxProps> = props => {
  const { checked, disabled, defaultChecked, className, style } = props

  const [selfChecked, setSelfChecked] = useState(defaultChecked)

  const finalChecked = useMemo(
    () => (checked !== undefined ? checked : selfChecked),
    [checked, selfChecked],
  )

  const compClsPrefix = 'react-app-ui-checkbox'
  const compClsName = classnames(compClsPrefix, className, {
    [`${compClsPrefix}__checked`]: finalChecked,
    [`${compClsPrefix}__disabled`]: disabled,
  })

  const onClick = () => {
    if (!disabled) {
      setSelfChecked(!finalChecked)
      props.onChange(!finalChecked)
    }
  }

  return (
    <div className={compClsName} style={style} onClick={onClick}>
      <div className={compClsPrefix + '-input'}>
        {finalChecked && <Icon type="check"></Icon>}
      </div>
      <div className={compClsPrefix + '-label'}>{props.children}</div>
    </div>
  )
}

Checkbox.defaultProps = defaultProps

export default Checkbox
