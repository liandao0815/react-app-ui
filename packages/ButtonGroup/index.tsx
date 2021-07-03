import React, { useCallback, useMemo, useState } from 'react'
import classnames from 'classnames'
import Button, { ButtonType } from '../Button'
import { noop } from '../utils'
import './index.less'

export type ButtonGroupOption = {
  value: string | number
  label: string
  disabled?: boolean
}

export type ButtonGroupValue = string | number | (string | number)[]

export type ButtonGroupProps = Readonly<
  {
    value?: ButtonGroupValue
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

const defaultProps = {
  options: [] as ButtonGroupOption[],
  onSelect: noop as (node: ButtonGroupOption) => void,
  onChange: noop as (value: ButtonGroupValue) => void,
  defaultValue: '' as ButtonGroupValue,
}

const ButtonGroup: React.FC<ButtonGroupProps> = props => {
  const { defaultValue, value, options, onChange, onSelect } = props

  const [selfValue, setSelfValue] = useState(defaultValue)

  const finalValue = useMemo(() => (value !== undefined ? value : selfValue), [
    value,
    selfValue,
  ])

  const compClsPrefix = 'react-app-ui-button-group'
  const compClsName = classnames(compClsPrefix, props.className)

  const getButtonType = (value: string | number): ButtonType => {
    if (Array.isArray(finalValue)) {
      return finalValue.includes(value) ? 'selected' : 'optional'
    } else {
      return finalValue === value ? 'selected' : 'optional'
    }
  }

  const onClick = useCallback(
    (option: ButtonGroupOption): void => {
      if (option.disabled) return

      let changeValue: ButtonGroupValue = null

      if (Array.isArray(finalValue)) {
        changeValue = finalValue.includes(option.value)
          ? (finalValue as string[]).filter(value => value !== option.value)
          : [...finalValue, option.value]
      } else {
        changeValue = option.value
      }

      setSelfValue(changeValue)
      onSelect(option)
      onChange(changeValue)
    },
    [onSelect, onChange, finalValue],
  )

  return (
    <ul className={compClsName} style={props.style}>
      {options.map(item => (
        <li key={item.value}>
          <Button
            className={compClsPrefix + '__button'}
            type={getButtonType(item.value)}
            key={item.value}
            disabled={item.disabled}
            onClick={onClick.bind(null, item)}
          >
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  )
}

ButtonGroup.defaultProps = defaultProps

export default ButtonGroup
