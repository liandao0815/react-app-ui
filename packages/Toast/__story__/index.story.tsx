import React from 'react'
import Toast from '../index'
import Button from '../../Button'

export default {
  title: 'Toast',
}

export const Demo = () => {
  return <Button onClick={() => Toast.info('toast')}>Toast</Button>
}
