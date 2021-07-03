import dayjs from 'dayjs'
import React, { useState } from 'react'
import Calendar from '../index'

export default {
  title: 'Calendar',
}

export const Demo = () => {
  const date = dayjs(new Date()).format('YYYY-MM-DD')
  const [value, setValue] = useState(date)

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        当前所选日期：{dayjs(value).format('YYYY-MM-DD')}
      </div>
      <Calendar
        showIndicator={true}
        value={value}
        minDate={date}
        onChange={setValue}
      ></Calendar>
    </div>
  )
}
