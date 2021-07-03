import React, { useState } from 'react'
import Checkbox from '../index'

export default {
  title: 'Checkbox',
}

export const Demo = () => {
  const [checked, setChecked] = useState(true)
  return (
    <div>
      <Checkbox
        style={{ marginBottom: '12px' }}
        checked={checked}
        onChange={checked => setChecked(checked)}
      >
        {checked ? '已选' : '未选'}
      </Checkbox>
      <Checkbox checked={true} disabled>
        禁用
      </Checkbox>
    </div>
  )
}
