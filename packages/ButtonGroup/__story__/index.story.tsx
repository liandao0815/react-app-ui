import React, { useCallback, useState } from 'react'
import ButtonGroup, { ButtonGroupOption } from '../index'

export default {
  title: 'ButtonGroup',
}

const options: ButtonGroupOption[] = [
  {
    value: '0',
    label: '选项一选项一选项一选项一',
  },
  {
    value: '1',
    label: '选项二',
  },
  {
    value: '2',
    label: '选项三',
    disabled: true,
  },
  {
    value: '3',
    label: '选项四',
    disabled: true,
  },
  {
    value: '4',
    label: '选项五',
  },
  {
    value: '5',
    label: '选项六',
  },
]

export const Demo = () => {
  const [value1, setValue1] = useState([])
  const [value2, setValue2] = useState('')

  const onChange1 = useCallback(value => {
    setValue1(value)
  }, [])
  const onChange2 = useCallback(value => {
    setValue2(value)
  }, [])

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          多选 selcted: {value1.toString()}
        </div>
        <ButtonGroup
          value={value1}
          options={options}
          onChange={onChange1}
        ></ButtonGroup>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>单选 selcted: {value2}</div>
        <ButtonGroup
          value={value2}
          options={options}
          onChange={onChange2}
        ></ButtonGroup>
      </div>
      <div>
        <div style={{ marginBottom: '20px' }}>非受控组件</div>
        <ButtonGroup defaultValue="" options={options}></ButtonGroup>
      </div>
    </>
  )
}
