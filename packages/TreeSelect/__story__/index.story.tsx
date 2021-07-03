import React, { useState } from 'react'
import TreeSelect, { TreeNode, TreeSelectValue } from '../index'

export default {
  title: 'TreeSelect',
}

const data: TreeNode[] = [
  {
    label: '一级1',
    value: 1,
    children: [
      {
        label: '二级1-1',
        value: 2,
        children: [
          {
            label: '三级1-1-1',
            value: 3,
          },
        ],
      },
    ],
  },
  {
    label: '一级2',
    value: 4,
    children: [
      {
        label: '二级2-1',
        value: 6,
        children: [
          {
            label: '三级2-1-1',
            value: 7,
          },
        ],
      },
      {
        label: '二级2-2',
        value: 8,
        children: [
          {
            label: '三级2-2-1',
            value: 9,
          },
        ],
      },
    ],
  },
  {
    label: '一级3',
    value: 10,
    children: [
      {
        label: '二级3-1',
        value: 11,
        disabled: true,
        children: [
          {
            label: '三级3-1-1',
            value: 12,
          },
        ],
      },
      {
        label: '二级3-2',
        value: 13,
        children: [
          {
            label: '三级3-2-1',
            value: 14,
          },
          {
            label: '三级3-2-2',
            value: 15,
          },
          {
            label: '三级3-2-3',
            value: 16,
          },
          {
            label: '三级3-2-4',
            value: 17,
          },
          {
            label: '三级3-2-5',
            value: 18,
            disabled: true,
          },
          {
            label: '三级3-2-6',
            value: 19,
          },
          {
            label: '三级3-2-7',
            value: 20,
          },
        ],
      },
    ],
  },
]

export const Demo = () => {
  const [value1, setValue1] = useState<TreeSelectValue>(15)
  const [value2, setValue2] = useState<TreeSelectValue>([19, 20])

  return (
    <>
      <div style={{ marginBottom: '20px' }}>单选-已选择：{value1}</div>
      <TreeSelect
        style={{ height: '208px' }}
        data={data}
        value={value1}
        onChange={value => setValue1(value)}
      ></TreeSelect>
      <div style={{ margin: '20px 0' }}>多选-已选择：{value2.toString()}</div>
      <TreeSelect
        style={{ height: '208px' }}
        data={data}
        value={value2}
        onChange={value => setValue2(value)}
      ></TreeSelect>
    </>
  )
}
