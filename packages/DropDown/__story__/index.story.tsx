import React from 'react'
import DropDown from '../index'
import Icon from '../../Icon'
import ScrollMenu, { ScrollMenuOption } from '../../ScrollMenu'

export default {
  title: 'DropDown',
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

export const Demo = () => (
  <div
    style={{
      marginTop: '40vh',
      boxSizing: 'border-box',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <DropDown label="下拉框" style={{ flex: 1 }}>
      <div style={{ height: '30vh', padding: '16px' }}>下拉框</div>
    </DropDown>
    <DropDown label="上拉框" direction="up" style={{ flex: 1 }}>
      <div style={{ height: '30vh', padding: '16px' }}>上拉框</div>
    </DropDown>
    <DropDown
      showCaret={false}
      label={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '6px' }}>自定义Icon</span>
          <Icon type="filter"></Icon>
        </span>
      }
      style={{ flex: 1 }}
    >
      <div style={{ height: '30vh', padding: '16px' }}>
        <ScrollMenu
          style={{ height: '350px' }}
          options={options}
          activeIndex={1}
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
      </div>
    </DropDown>
  </div>
)
