import React, { useCallback } from 'react'
import ScrollMenu, { ScrollMenuOption } from '../index'

export default {
  title: 'ScrollMenu',
}

const options: ScrollMenuOption[] = [
  {
    label: '设备',
    title: '会议设备',
  },
  {
    label: '人数',
    title: '会议人数',
  },
  {
    label: '时间',
    title: '会议时间',
  },
  {
    label: '时长',
    title: '会议时长',
  },
]

export const Demo = () => {
  const onMenuClick = useCallback((index: number) => {
    console.log(index)
  }, [])

  return (
    <ScrollMenu
      style={{ height: '350px' }}
      options={options}
      activeIndex={1}
      onMenuClick={onMenuClick}
    >
      <div>
        <p>菜单一 content</p>
        <p>菜单一 content</p>
        <p>菜单一 content</p>
        <p>菜单一 content</p>
        <p>菜单一 content</p>
        <p>菜单一 content</p>
      </div>
      <div>
        <p>菜单二 content</p>
        <p>菜单二 content</p>
        <p>菜单二 content</p>
        <p>菜单二 content</p>
        <p>菜单二 content</p>
      </div>
      <div>
        <p>菜单三 content</p>
        <p>菜单三 content</p>
        <p>菜单三 content</p>
        <p>菜单三 content</p>
        <p>菜单三 content</p>
      </div>
      <div>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
        <p>菜单四 content</p>
      </div>
    </ScrollMenu>
  )
}
